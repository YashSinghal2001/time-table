package org.mollysanimalsanctuary.app.data

enum class Species(val label: String, val emoji: String) {
    DOG("Dog", "🐶"),
    CAT("Cat", "🐱"),
    RABBIT("Rabbit", "🐰"),
    BIRD("Bird", "🐦"),
    OTHER("Other", "🐾"),
}

enum class Gender(val label: String) {
    MALE("Male"),
    FEMALE("Female"),
}

data class Pet(
    val id: String,
    val name: String,
    val species: Species,
    val breed: String,
    val age: String,
    val gender: Gender,
    val area: String,
    val description: String,
    val vaccinated: Boolean,
    val sterilized: Boolean,
    val ownerName: String,
    val ownerPhone: String,
    /** Absolute path of a photo stored in the app's private files, or null for sample pets. */
    val imagePath: String? = null,
    /** True for pets this user put up for rehoming from this device. */
    val listedByMe: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
)

data class Profile(
    val name: String = "",
    val phone: String = "",
    val email: String = "",
    val area: String = "",
) {
    val isComplete: Boolean
        get() = name.isNotBlank() && phone.isNotBlank()
}

object KolkataAreas {
    val all = listOf(
        "Salt Lake",
        "New Town",
        "Park Street",
        "Ballygunge",
        "Gariahat",
        "Behala",
        "Tollygunge",
        "Jadavpur",
        "Garia",
        "Dum Dum",
        "Howrah",
        "Esplanade",
    )
}
