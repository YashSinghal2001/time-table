package org.mollysanimalsanctuary.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pets
import androidx.compose.material.icons.filled.VolunteerActivism
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import org.mollysanimalsanctuary.app.data.KolkataAreas
import org.mollysanimalsanctuary.app.ui.SanctuaryViewModel
import org.mollysanimalsanctuary.app.ui.components.PetTile

@Composable
fun HomeScreen(
    viewModel: SanctuaryViewModel,
    onAdopt: () -> Unit,
    onRehome: () -> Unit,
    onAreaSelected: (String) -> Unit,
    onPetClick: (String) -> Unit,
) {
    val pets by viewModel.allPets.collectAsStateWithLifecycle()
    val profile by viewModel.profile.collectAsStateWithLifecycle()

    LazyColumn(
        contentPadding = PaddingValues(bottom = 24.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp),
    ) {
        item {
            Column(
                Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
                    .clip(RoundedCornerShape(28.dp))
                    .background(Brush.linearGradient(listOf(Color(0xFFE8692C), Color(0xFFF2A65A))))
                    .padding(24.dp),
            ) {
                Text("🐾", style = MaterialTheme.typography.headlineLarge)
                Spacer(Modifier.height(8.dp))
                Text(
                    if (profile.name.isNotBlank()) "Hi ${profile.name.substringBefore(' ')}!" else "Welcome!",
                    style = MaterialTheme.typography.titleMedium,
                    color = Color.White.copy(alpha = 0.9f),
                )
                Text(
                    "Molly's Animal Sanctuary",
                    style = MaterialTheme.typography.headlineMedium,
                    color = Color.White,
                )
                Spacer(Modifier.height(6.dp))
                Text(
                    "Every pet deserves a loving home. Adopt a friend, or find a caring new family for yours, right here in Kolkata.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.White.copy(alpha = 0.92f),
                )
            }
        }

        item {
            Text(
                "What would you like to do?",
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.padding(horizontal = 20.dp),
            )
            Spacer(Modifier.height(12.dp))
            Row(
                Modifier.padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                ChoiceCard(
                    icon = Icons.Filled.Pets,
                    title = "Adopt a Pet",
                    body = "Browse dogs, cats and more waiting for a home near you.",
                    container = MaterialTheme.colorScheme.primaryContainer,
                    content = MaterialTheme.colorScheme.onPrimaryContainer,
                    onClick = onAdopt,
                    modifier = Modifier.weight(1f),
                )
                ChoiceCard(
                    icon = Icons.Filled.VolunteerActivism,
                    title = "Rehome a Pet",
                    body = "Can't keep your pet? Donate them to a caring new family.",
                    container = MaterialTheme.colorScheme.secondaryContainer,
                    content = MaterialTheme.colorScheme.onSecondaryContainer,
                    onClick = onRehome,
                    modifier = Modifier.weight(1f),
                )
            }
        }

        item {
            Row(
                Modifier.fillMaxWidth().padding(start = 20.dp, end = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text("Waiting for a home", style = MaterialTheme.typography.titleLarge, modifier = Modifier.weight(1f))
                TextButton(onClick = onAdopt) { Text("See all (${pets.size})") }
            }
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                items(pets.take(8), key = { it.id }) { pet ->
                    PetTile(pet, onClick = { onPetClick(pet.id) })
                }
            }
        }

        item {
            Text(
                "Browse by area in Kolkata",
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.padding(horizontal = 20.dp),
            )
            Spacer(Modifier.height(8.dp))
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                items(KolkataAreas.all) { area ->
                    val count = pets.count { it.area == area }
                    AssistChip(
                        onClick = { onAreaSelected(area) },
                        label = { Text(if (count > 0) "$area ($count)" else area) },
                    )
                }
            }
        }
    }
}

@Composable
private fun ChoiceCard(
    icon: ImageVector,
    title: String,
    body: String,
    container: Color,
    content: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Card(
        onClick = onClick,
        modifier = modifier.height(190.dp),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = container, contentColor = content),
    ) {
        Column(Modifier.padding(16.dp)) {
            Icon(icon, contentDescription = null, modifier = Modifier.size(36.dp))
            Spacer(Modifier.height(12.dp))
            Text(title, style = MaterialTheme.typography.titleMedium)
            Spacer(Modifier.height(4.dp))
            Text(body, style = MaterialTheme.typography.bodySmall)
        }
    }
}
