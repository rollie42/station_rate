package station_rate

import com.google.maps.model.LatLng
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
    var restaurantScore: Double? = null
    var priceScore: Double? = null
    var isNearShinkansen: Boolean? = null
    var isNearCostco: Boolean? = null

    // val lines: MutableList<Line> = mutableListOf()
    val names: MutableList<StationName> = mutableListOf()

    // Helpers
    val coords: LatLng get() = LatLng(lat, lng)
    val englishName: String? get() = names.firstOrNull { it.type == StationNameType.English }?.name
    val kanjiName: String? get() = names.firstOrNull { it.type == StationNameType.Kanji }?.name
}
