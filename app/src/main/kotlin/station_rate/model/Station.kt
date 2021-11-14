package station_rate

import kotlinx.serialization.*

@Serializable
enum class StationNameType {
    Kanji,
    Kana,
    Romaji,
    English
}

@Serializable
class StationName(
    val name: String,
    val type: StationNameType
)

@Serializable
class Station(
    val lat: Double,
    val lng: Double

) {
    // val lines: MutableList<Line> = mutableListOf()
    val names: MutableList<StationName> = mutableListOf()
    val englishName: String? get() = names.firstOrNull { it.type == StationNameType.English }?.name
    val kanjiName: String? get() = names.firstOrNull { it.type == StationNameType.Kanji }?.name
}
