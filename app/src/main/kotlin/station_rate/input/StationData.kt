package station_rate.input.station

import kotlinx.serialization.*
import kotlinx.serialization.json.Json

// Top level for stations.json
@Serializable
data class StationGroup(
    val alternative_names: List<String>, // TODO: any?
    val ekidata_line_ids: List<String>,
    val group_code: String,
    val line_codes: List<String>, // TODO: any?
    val name_kana: String,
    val name_kanji: String,
    val name_romaji: String,
    val prefecture: String,
    val stations: List<Station>
)

// Sub-level for stations.json
@Serializable
data class Station(
    val code: String,
    val ekidata_group_id: String,
    val ekidata_id: String,
    val ekidata_line_id: String,
    val lat: Double,
    val line_code: String,
    val lon: Double,
    val name_kanji: String,
    val prefecture: String,
    val short_code: String
) {
    val id: Int get() = ekidata_id.toInt()
}

// This is our base data; it groups stations by location, but doesn't have good translations, so needs to be enriched
fun loadStationData(): List<StationGroup> {
    val txt = Thread.currentThread().contextClassLoader.getResource("stations.json").readText()
    val root = Json.decodeFromString<List<StationGroup>>(txt)
    println(root)
    return root
}