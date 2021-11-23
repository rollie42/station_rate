package station_rate.moshi

import com.squareup.moshi.*
import java.net.URL
import java.time.LocalTime

class UrlAdapter : JsonAdapter<URL>(){
    @ToJson
    override fun toJson(writer: JsonWriter, value: URL?) {
        value?.let {
            writer.value(it.toString())
        }
    }

    @FromJson
    override fun fromJson(reader: JsonReader): URL? {
        return if (reader.peek() != JsonReader.Token.NULL) {
            return URL(reader.nextString())
        } else {
            reader.nextNull<Any>()
            null
        }
    }
}

class LocalTimeAdapter {
    @ToJson
    fun toJson(value: LocalTime): String {
        return value.toString()
    }

    @FromJson
    fun fromJson(value: String): LocalTime {
        return LocalTime.parse(value)
    }
}