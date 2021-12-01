val ktorVersion: String = "1.6.6"

plugins {
    // Apply the org.jetbrains.kotlin.jvm Plugin to add support for Kotlin.
    kotlin("jvm") version "1.5.30"
    kotlin("plugin.serialization") version "1.5.30"

    // Apply the application plugin to add support for building a CLI application in Java.
    application
}

repositories {
    // Use JCenter for resolving dependencies.
    jcenter()
}

dependencies {
    // Align versions of all Kotlin components
    implementation(platform("org.jetbrains.kotlin:kotlin-bom"))

    implementation("com.google.maps:google-maps-services:0.19.0")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.3.0-RC")

    implementation("com.google.guava:guava:29.0-jre")
    implementation("de.brudaswen.kotlinx.serialization:kotlinx-serialization-csv:2.0.0")

    testImplementation("org.jetbrains.kotlin:kotlin-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit")

    implementation("com.squareup.moshi:moshi:1.12.0")
    implementation("com.squareup.moshi:moshi-kotlin:1.12.0")
    implementation("com.squareup.moshi:moshi-adapters:1.12.0")

    implementation("io.ktor:ktor-client-core:$ktorVersion")
    implementation("io.ktor:ktor-client-cio:$ktorVersion")
}

application {
    // Define the main class for the application.
    mainClass.set("station_rate.AppKt")
}
