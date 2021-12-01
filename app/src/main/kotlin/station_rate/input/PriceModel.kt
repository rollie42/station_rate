package station_rate.input.pricing

import kotlinx.serialization.*
import kotlinx.serialization.csv.Csv
import kotlinx.serialization.json.Json
import station_rate.normalize
import java.io.File
import java.lang.Math.pow
import java.util.*
import kotlin.math.*
import kotlin.system.measureTimeMillis

@Serializable
data class PriceModel(
    val No: Int,
    val Type: String,
    val Region: String,
    val MunicipalityCode: Int?,
    val Prefecture: String,
    val Municipality: String,
    val DistrictName: String,
    val NearestStation: String,
    val TimeToNearestStation: Long,
    val MinTimeToNearestStation: Int?,
    val MaxTimeToNearestStation: Int?,
    val TradePrice: Long,
    val FloorPlan: String?,
    val Area: Long,
    val AreaIsGreaterFlag: Int?,
    val UnitPrice: Float?,
    val PricePerTsubo: Float?,
    val LandShape: String?,
    val Frontage: Float?,
    val FrontageIsGreaterFlag: Boolean?,
    val TotalFloorArea: String?,
    val TotalFloorAreaIsGreaterFlag: Int?,
    val BuildingYear: Int,
    val PrewarBuilding: Int?,
    val Structure: String?,
    val Use: String?,
    val Purpose: String?,
    val Direction: String?,
    val Classification: String?,
    val Breadth: String?,
    val CityPlanning: String?,
    val CoverageRatio: String?,
    val FloorAreaRatio: String?,
    val Period: String?,
    val Year: String,
    val Quarter: String,
    val Renovation: String?,
    val Remarks: String?
) {
    val nearestStationNormalized get() = this.NearestStation.normalize()
    val adjustedAge = 2021L - BuildingYear + if (Renovation?.equals("Done") == true) 10 else 0
    val adjustedPrice get() = this.priceMult!! * this.TradePrice
    var priceMult: Double? = null
    var confidence: Double = 0.0

    fun distance(other: PriceModel): Pair<Double, Double> {
        fun Long.d(other: Long) = (this - other).toDouble()

        val ageD = adjustedAge.d(other.adjustedAge)
        val sizeD = Area.d(other.Area)
        val distD = TimeToNearestStation.d(other.TimeToNearestStation)

        if (ageD > 15 || sizeD > 15 || distD > 13){
            return 100.0 to 100.0 // save us the calcs
        }

        val ageDS = abs(ageD).pow(1.5)
        val sizeDS = abs(sizeD).pow(1.5)
        val distDS = abs(distD).pow(2)

        val absoluteDif = sqrt(ageDS + sizeDS + distDS)
        val relativeDifWhole = ageDS.withSign(ageD) + sizeDS.withSign(sizeD) + distDS.withSign(distD)
        val relativeDif = sqrt(relativeDifWhole.absoluteValue).withSign(relativeDifWhole)

        return absoluteDif to relativeDif + sqrt(absoluteDif).withSign(relativeDif)
    }

    override fun toString() = "$adjustedAge-$Area-$TimeToNearestStation-$TradePrice"
}

@ExperimentalSerializationApi
fun loadPricingData(useCached: Boolean = true): Map<String, Double> {
    val priceFile = File("/tmp/station-rate/pricing.json")
    if (useCached && priceFile.exists()) {
        val results = Json.decodeFromString<Map<String, Double>>(priceFile.readText())
        return results.mapValues { 5.0 - it.value.coerceIn(0.4, 5.0) }
    }

    val csv = Csv {
        hasHeaderRecord = false
        ignoreEmptyLines = true
    }
    var failures = 0

    val pricing = listOf("housing_prices_11.csv", "housing_prices_13.csv", "housing_prices_14.csv").flatMap {

        val txt = Thread.currentThread().contextClassLoader.getResource(it).readText()

        val pricing = txt
            .lines()
            .drop(1)
            .mapNotNull {
                try {
                    csv.decodeFromString<PriceModel>(it)
                } catch (e: Throwable) {
                    failures++
                    null
                }
            }
        pricing
    }.filter { it.Area < 200 } // Remove super large entries - these are likely multi-unit buildings

    println("$failures entries failed")
    println()
    val stationPriceData = pricing
        .groupBy { it.nearestStationNormalized }
        .toList()
        .sortedByDescending { it.second.size }

    val refStation = stationPriceData.first()
    println("Using reference station '${refStation.first}'")

    val supportStations = stationPriceData.take(21)
    supportStations.forEach { p ->
        p.second.forEach { it.confidence = 0.7 }
    }
    refStation.second.forEach { it.confidence = 1.0; it.priceMult = 1.0; }
    val indexedRecords = refStation.second.groupBy { it.Area }

    // Calc the priceMult for support stations
    supportStations.drop(1).forEach { p ->
        p.second.forEach { record ->
            val ref = indexedRecords.filter{ abs(record.Area - it.key) <= 5 }.flatMap { it.value }
            val relativeDistances = ref //refStation.second
                .map {
                    val d = it.distance(record)
                    d to it.adjustedPrice
                }
                .filter{ p -> p.first.first < 7.0} // TODO
                .map { p -> p.first.second to p.second } // Remove absolute distance - no longer need it
            val around = relativeDistances.aroundBy(0.0, 3) { it.first }
            val refPrice = listOf(around.same, around.lower, around.higher)
                .flatten()
                .map { it.second }
                .average()

            if (refPrice.isNaN()) {
                println("nani??")
            }

            record.priceMult = refPrice / record.TradePrice
        }
    }

    val referenceGroups = pricing
        .filter { it.priceMult != null && !it.priceMult!!.isNaN() }
        .groupBy { it.Area }

    failures = 0
    pricing
        .filter { it.priceMult == null }
        // .filter { it.nearestStationNormalized == "kawaguchi"} // TODO: remove
        .groupBy { it.Area }
        .forEach {
            station_rate.log(it.key.toString())
            val candidates = referenceGroups
                .filter { abs(it.key - it.key) <= 5 }
                .flatMap { it.value }

            it.value.forEach { record ->
                val relativeDistances = candidates
                    .map {
                        val d = it.distance(record)
                        d to it.adjustedPrice
                    }
                    .filter{ p -> p.first.first < 7.0}
                    .map { p -> p.first.second to p.second } // Remove absolute distance - no longer need it

                val around = relativeDistances.aroundBy(0.0, 3) { it.first }
                val refPrice = listOf(around.same, around.lower, around.higher)
                    .flatten()
                    .map { it.second }
                    .average()

                if (refPrice.isNaN()) {
                    failures++
                }

                record.priceMult = refPrice / record.TradePrice
            }
        }

    println("$failures entries couldn't be matched")
    val x = stationPriceData.first { it.first == "kawaguchi" }.second.map{ it.priceMult }
    //val y = x.second.map { it.priceMult!! }.average()

    val results = stationPriceData.map {
        it.first to it.second.filter { !it.priceMult!!.isNaN() }.map { it.priceMult!! }.average()
    }.toMap()

    results
        .toList()
        .sortedByDescending { it.second }
        .forEach {
            println("${it.first}: ${it.second}")
        }

    val json = Json.encodeToString(results)
    priceFile.writeText(json)

    return results.mapValues { 5.0 - it.value.coerceIn(0.4, 5.0) }
}

fun <T, R : Comparable<R>> Iterable<T>.minBy(n: Int, selector: (T) -> R): List<T> {
    val buffer = sortedSetOf<Pair<R, T>>(compareBy { it.first })
    for (el in this) {
        buffer += selector(el) to el
        if (buffer.size > n) {
            buffer.remove(buffer.last())
        }
    }

    return buffer.map { it.second }
}

fun <T, R : Comparable<R>> Iterable<T>.maxBy(n: Int, selector: (T) -> R): List<T> {
    val buffer = sortedSetOf<Pair<R, T>>(compareBy { it.first })
    for (el in this) {
        buffer += selector(el) to el
        if (buffer.size > n) {
            buffer.remove(buffer.first())
        }
    }

    return buffer.map { it.second }
}

data class AroundResult<T>(val same: List<T>, val lower: List<T>, val higher: List<T>)

fun <T, R : Comparable<R>> Iterable<T>.aroundBy(target: R, n: Int, selector: (T) -> R): AroundResult<T> {
    val same = this.filter { selector(it) == target}
    val lower = this.filter { selector(it) < target}.minBy(n, selector)
    val higher = this.filter { selector(it) > target}.minBy(n, selector)

    return AroundResult(
        same,
        lower.take(higher.size),
        higher.take(lower.size)
    )
}