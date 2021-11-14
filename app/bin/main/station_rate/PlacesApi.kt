import com.google.maps.GeoApiContext
import com.google.maps.PlacesApi
import com.google.maps.model.LatLng
import com.google.maps.model.PlaceType
import station_rate.input.station.*

class MyPlacesApi {
    val context = GeoApiContext.Builder().apiKey("").build()

    fun getRestaurantScore(station: Station) {
        val req = PlacesApi.nearbySearchQuery(context, LatLng(station.lat, station.lon))
        val resp = req
            .type(PlaceType.RESTAURANT)
            .keyword("indian")
            .radius(1000)
            .await()
    }
}