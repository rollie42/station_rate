package station_rate.input.stations.metadata

import kotlinx.serialization.*
import kotlinx.serialization.json.Json

// Classes for stations_metadata.json

@Serializable
data class Name (val ja: String, val en: String)

@Serializable
data class Region (
    val id: Int,
    val name: Name,
    val lines: List<Line>
)

@Serializable
data class Line (
    val id: Int,
    val name: Name,
    val lat: Double,
    val lng: Double,
    val stations: List<Station>
)

@Serializable
data class Location (
    val lat: Double,
    val lng: Double
)

@Serializable
data class Station (
    val id: Int,
    val gid: Int,
    val name: Name,
    val location: Location
) {
    val lat get() = location.lat
    val lng get() = location.lng
}

fun loadStationMetadata(): List<Region> {
    val txt = Thread.currentThread().contextClassLoader.getResource("station_metadata.json").readText()
    val root = Json {ignoreUnknownKeys = true}.decodeFromString<List<Region>>(txt)
    return root
}