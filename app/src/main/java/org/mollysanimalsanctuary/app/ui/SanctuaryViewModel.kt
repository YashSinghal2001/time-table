package org.mollysanimalsanctuary.app.ui

import android.app.Application
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import org.mollysanimalsanctuary.app.data.Pet
import org.mollysanimalsanctuary.app.data.Profile
import org.mollysanimalsanctuary.app.data.SamplePets
import org.mollysanimalsanctuary.app.data.SanctuaryRepository
import org.mollysanimalsanctuary.app.data.Species

class SanctuaryViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = SanctuaryRepository(application)

    val profile: StateFlow<Profile> = repository.profile
    val adoptionRequests: StateFlow<Set<String>> = repository.adoptionRequests
    val myPets: StateFlow<List<Pet>> = repository.myPets

    /** Every animal available for adoption: newly rehomed pets first, then the sanctuary's. */
    val allPets: StateFlow<List<Pet>> = repository.myPets
        .map { it + SamplePets.all }
        .stateIn(viewModelScope, SharingStarted.Eagerly, SamplePets.all)

    private val _areaFilter = MutableStateFlow<String?>(null)
    val areaFilter: StateFlow<String?> = _areaFilter.asStateFlow()

    private val _speciesFilter = MutableStateFlow<Species?>(null)
    val speciesFilter: StateFlow<Species?> = _speciesFilter.asStateFlow()

    val filteredPets: StateFlow<List<Pet>> =
        combine(allPets, _areaFilter, _speciesFilter) { pets, area, species ->
            pets.filter { (area == null || it.area == area) && (species == null || it.species == species) }
        }.stateIn(viewModelScope, SharingStarted.Eagerly, SamplePets.all)

    fun setAreaFilter(area: String?) {
        _areaFilter.value = area
    }

    fun setSpeciesFilter(species: Species?) {
        _speciesFilter.value = species
    }

    fun findPet(id: String): Pet? = allPets.value.firstOrNull { it.id == id }

    fun listPet(pet: Pet, photo: Uri?, onDone: (Pet) -> Unit) {
        viewModelScope.launch { onDone(repository.addPet(pet, photo)) }
    }

    fun removePet(id: String) = repository.removePet(id)

    fun saveProfile(profile: Profile) = repository.saveProfile(profile)

    fun requestAdoption(petId: String) = repository.requestAdoption(petId)
}
