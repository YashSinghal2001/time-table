package org.mollysanimalsanctuary.app.data

import android.content.Context
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.util.UUID

/**
 * Stores everything on the device (no login, no server): the user's profile, pets they
 * listed for rehoming, and the pets they asked to adopt.
 */
class SanctuaryRepository(context: Context) {

    private val appContext = context.applicationContext
    private val prefs = appContext.getSharedPreferences("sanctuary", Context.MODE_PRIVATE)

    private val _myPets = MutableStateFlow(loadMyPets())
    private val _profile = MutableStateFlow(loadProfile())
    private val _adoptionRequests = MutableStateFlow(
        prefs.getStringSet(KEY_REQUESTS, emptySet()).orEmpty().toSet()
    )

    val myPets: StateFlow<List<Pet>> = _myPets.asStateFlow()
    val profile: StateFlow<Profile> = _profile.asStateFlow()
    val adoptionRequests: StateFlow<Set<String>> = _adoptionRequests.asStateFlow()

    suspend fun addPet(pet: Pet, photo: Uri?): Pet {
        val id = "pet-" + UUID.randomUUID().toString()
        val imagePath = photo?.let { copyPhoto(it, id) }
        val saved = pet.copy(id = id, imagePath = imagePath, listedByMe = true)
        _myPets.update { listOf(saved) + it }
        saveMyPets()
        return saved
    }

    fun removePet(id: String) {
        _myPets.value.firstOrNull { it.id == id }?.imagePath?.let { File(it).delete() }
        _myPets.update { pets -> pets.filterNot { it.id == id } }
        saveMyPets()
    }

    fun saveProfile(profile: Profile) {
        _profile.value = profile
        prefs.edit()
            .putString(KEY_NAME, profile.name)
            .putString(KEY_PHONE, profile.phone)
            .putString(KEY_EMAIL, profile.email)
            .putString(KEY_AREA, profile.area)
            .apply()
    }

    fun requestAdoption(petId: String) {
        _adoptionRequests.update { it + petId }
        prefs.edit().putStringSet(KEY_REQUESTS, _adoptionRequests.value).apply()
    }

    private suspend fun copyPhoto(uri: Uri, id: String): String? = withContext(Dispatchers.IO) {
        runCatching {
            val dir = File(appContext.filesDir, "pets").apply { mkdirs() }
            val target = File(dir, "$id.jpg")
            appContext.contentResolver.openInputStream(uri)?.use { input ->
                target.outputStream().use { output -> input.copyTo(output) }
            } ?: return@runCatching null
            target.absolutePath
        }.getOrNull()
    }

    private fun loadProfile() = Profile(
        name = prefs.getString(KEY_NAME, "").orEmpty(),
        phone = prefs.getString(KEY_PHONE, "").orEmpty(),
        email = prefs.getString(KEY_EMAIL, "").orEmpty(),
        area = prefs.getString(KEY_AREA, "").orEmpty(),
    )

    private fun loadMyPets(): List<Pet> {
        val raw = prefs.getString(KEY_PETS, null) ?: return emptyList()
        return runCatching {
            val array = JSONArray(raw)
            (0 until array.length()).map { array.getJSONObject(it).toPet() }
        }.getOrDefault(emptyList())
    }

    private fun saveMyPets() {
        val array = JSONArray()
        _myPets.value.forEach { array.put(it.toJson()) }
        prefs.edit().putString(KEY_PETS, array.toString()).apply()
    }

    private fun Pet.toJson() = JSONObject()
        .put("id", id)
        .put("name", name)
        .put("species", species.name)
        .put("breed", breed)
        .put("age", age)
        .put("gender", gender.name)
        .put("area", area)
        .put("description", description)
        .put("vaccinated", vaccinated)
        .put("sterilized", sterilized)
        .put("ownerName", ownerName)
        .put("ownerPhone", ownerPhone)
        .put("imagePath", imagePath ?: "")
        .put("createdAt", createdAt)

    private fun JSONObject.toPet() = Pet(
        id = getString("id"),
        name = getString("name"),
        species = runCatching { Species.valueOf(getString("species")) }.getOrDefault(Species.OTHER),
        breed = optString("breed"),
        age = optString("age"),
        gender = runCatching { Gender.valueOf(getString("gender")) }.getOrDefault(Gender.MALE),
        area = optString("area"),
        description = optString("description"),
        vaccinated = optBoolean("vaccinated"),
        sterilized = optBoolean("sterilized"),
        ownerName = optString("ownerName"),
        ownerPhone = optString("ownerPhone"),
        imagePath = optString("imagePath").ifBlank { null },
        listedByMe = true,
        createdAt = optLong("createdAt"),
    )

    private companion object {
        const val KEY_PETS = "my_pets"
        const val KEY_REQUESTS = "adoption_requests"
        const val KEY_NAME = "profile_name"
        const val KEY_PHONE = "profile_phone"
        const val KEY_EMAIL = "profile_email"
        const val KEY_AREA = "profile_area"
    }
}
