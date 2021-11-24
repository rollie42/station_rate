package station_rate.input

import com.google.maps.model.LatLng

class StaticData{
    companion object {
        val shikansenStations: List<LatLng> = listOf(
            LatLng(35.5068, 139.6176), // Shin-yokohama
            LatLng(35.5963, 139.3432), // Hashimoto Station (future)
            LatLng(35.6289, 139.7381), // Shinagawa
            LatLng(35.6809, 139.7664), // Tokyo
            LatLng(35.7145, 139.7775), // Ueno
            LatLng(35.9063, 139.6228), // Omiya
        )

        val costcos: List<LatLng> = listOf(
            LatLng(35.8114, 139.3782), // Iruma
            LatLng(35.86086693127173, 139.86443448161378), // Shinmisato
            LatLng(35.806113769136736, 140.12881565900017), // Chiba
            LatLng(35.65422525198022, 140.02756703338903), // Makuhari
            LatLng(35.52255214295277, 139.73214928896394), // Kawasaki
            LatLng(35.601273865366046, 139.37684253145252), // Tama
            LatLng(35.482153495039945, 139.42706954204704), // Zama
            LatLng(35.36287912382176, 139.6470689654439), // Kanazawa
        )
    }
}