package org.mollysanimalsanctuary.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.FilterChip
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import org.mollysanimalsanctuary.app.data.KolkataAreas
import org.mollysanimalsanctuary.app.data.Species
import org.mollysanimalsanctuary.app.ui.SanctuaryViewModel
import org.mollysanimalsanctuary.app.ui.components.PetCard
import org.mollysanimalsanctuary.app.ui.components.ScreenHeader

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdoptScreen(viewModel: SanctuaryViewModel, onPetClick: (String) -> Unit) {
    val pets by viewModel.filteredPets.collectAsStateWithLifecycle()
    val area by viewModel.areaFilter.collectAsStateWithLifecycle()
    val species by viewModel.speciesFilter.collectAsStateWithLifecycle()

    Column(Modifier.fillMaxSize()) {
        ScreenHeader("Adopt a Pet", "Animals looking for a forever home in Kolkata")

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            item {
                FilterChip(selected = species == null, onClick = { viewModel.setSpeciesFilter(null) }, label = { Text("All animals") })
            }
            items(Species.entries) { s ->
                FilterChip(
                    selected = species == s,
                    onClick = { viewModel.setSpeciesFilter(if (species == s) null else s) },
                    label = { Text("${s.emoji} ${s.label}") },
                )
            }
        }
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            item {
                FilterChip(selected = area == null, onClick = { viewModel.setAreaFilter(null) }, label = { Text("All areas") })
            }
            items(KolkataAreas.all) { a ->
                FilterChip(
                    selected = area == a,
                    onClick = { viewModel.setAreaFilter(if (area == a) null else a) },
                    label = { Text(a) },
                )
            }
        }

        if (pets.isEmpty()) {
            Text(
                "No pets match these filters yet.\nTry another area or animal.",
                textAlign = TextAlign.Center,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.fillMaxWidth().padding(32.dp),
            )
        } else {
            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                item {
                    Text(
                        "${pets.size} ${if (pets.size == 1) "pet" else "pets"} available",
                        style = MaterialTheme.typography.labelLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                items(pets, key = { it.id }) { pet ->
                    PetCard(pet, onClick = { onPetClick(pet.id) })
                }
            }
        }
    }
}
