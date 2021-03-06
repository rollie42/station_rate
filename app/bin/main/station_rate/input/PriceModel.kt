package station_rate.input.pricing

import kotlinx.serialization.*
import kotlinx.serialization.csv.Csv
import station_rate.normalize

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
    val dist: String get() {
        return when {
            TimeToNearestStation <= 5 -> "close"
            TimeToNearestStation <= 10 -> "not far"
            TimeToNearestStation <= 15 -> "kinda far"
            else -> "distant"
        }
    }

    val size: String get() {
        return when {
            Area > 90 -> "huge"
            Area > 75 -> "large"
            Area > 60 -> "medium"
            Area > 45 -> "small"
            else -> "tiny"
        }
    }

    val age: String get() {
        val relativeAge = 2021 - BuildingYear + if (Renovation?.equals("Done") == true) 10 else 0
        return when {
            relativeAge < 5 -> "brand new"
            relativeAge < 10 -> "new"
            relativeAge < 20 -> "newish"
            relativeAge < 30 -> "aging"
            else -> "old"
        }
    }

    val nearestStationNormalized get() = this.NearestStation.normalize()
}

@ExperimentalSerializationApi
fun loadPricingData(): Map<String, Double> {
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
    }

    println("$failures entries failed")
    println()
    val stationPriceData = pricing
        .groupBy { it.nearestStationNormalized }
        .mapValues {
            it.value.groupBy { entry ->
                "${entry.age}-${entry.size}-${entry.dist}"
            }
        }

    val refStation = stationPriceData
        .maxByOrNull { it.value.size }!!

    println("Using reference station '${refStation.key}'")

    val referenceRecords = refStation.value.mapValues {
            it.value.map { it.TradePrice }.average()
        }

    failures = 0
    val relativePrices = stationPriceData.mapValues {
        it.value.flatMap<String, List<PriceModel>, Double> {
            val refCost = referenceRecords[it.key]
            val vals = it.value
            if (refCost == null) {
                failures++
                return@flatMap listOf<Double>()
            }

            return@flatMap vals.map { entry ->
                entry.TradePrice / refCost
            }

        }
        }.mapValues {
            it.value.map {
                it.coerceIn(.1, 5.0) }.average()
        }

    println("$failures entries couldn't be matched")
//    relativePrices
//        .toList()
//        .sortedByDescending { it.second }
//        .forEach {
//            println("${it.first}: ${it.second}")
//        }

    return relativePrices
}