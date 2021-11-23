import com.google.maps.GeoApiContext
import com.google.maps.NearbySearchRequest
import com.google.maps.PlacesApi
import com.google.maps.model.LatLng
import com.google.maps.model.PlaceType
import com.google.maps.model.PlacesSearchResponse
import com.squareup.moshi.*
import com.squareup.moshi.kotlin.reflect.*
import com.squareup.moshi.kotlin.*
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import station_rate.Station
import station_rate.input.station.*
import station_rate.moshi.LocalTimeAdapter
import station_rate.moshi.UrlAdapter
import java.io.File
import java.net.URL
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.format.DateTimeFormatter

class MyPlacesApi {
    val context = GeoApiContext.Builder().apiKey(File("/tmp/station-rate.key").readText()).build()
    val queryCache = "/tmp/station-rate/query-cache/"

    fun getRestaurantScore(station: Station): Double {
        return listOf("indian", "mexican", "thai")
            .map { cachedQuery(station.lat, station.lng, PlaceType.RESTAURANT, it, 700).score() }
            .average()
    }

    fun getTrainStation(lat: Double, lon: Double): PlacesSearchResponse {
        val res = cachedQuery(lat, lon, PlaceType.TRAIN_STATION, "", 50)
        if (res.results.isNotEmpty())
            return res

        println("Trying 100m station query")
        return cachedQuery(lat, lon, PlaceType.TRAIN_STATION, "", 100)
    }

    private fun cachedQuery(lat: Double, lon: Double, type: PlaceType, keyword: String, radiusMeters: Int): PlacesSearchResponse {
        val key = "$lat-$lon-$type-$keyword-$radiusMeters"

        val cache = File(queryCache + key)

        val moshi = Moshi
            .Builder()
            .add(UrlAdapter())
            .add(LocalTimeAdapter())
            .addLast(KotlinJsonAdapterFactory())
            .build()
        val adapter = moshi.adapter(PlacesSearchResponse::class.java)

        if (cache.exists()) {
            println("Using cached value")
            return adapter.fromJson(cache.readText())!!
        }

        val req = PlacesApi.nearbySearchQuery(context, LatLng(lat, lon))
        val resp = req
            .type(type)
            .keyword(keyword)
            .radius(radiusMeters)
            .language("en")
            .await()!!

        println("Calling Places API")

        val json = adapter.toJson(resp)
        cache.writeText(json)

        return resp
    }
}

private fun PlacesSearchResponse.score() = 1.0 - (1.0 / (this.results.size + 1))
