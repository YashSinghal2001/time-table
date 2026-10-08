package org.mollysanimalsanctuary.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import org.mollysanimalsanctuary.app.data.Pet
import org.mollysanimalsanctuary.app.data.Species
import java.io.File

private fun speciesGradient(species: Species): Brush = when (species) {
    Species.DOG -> Brush.linearGradient(listOf(Color(0xFFFFD3B6), Color(0xFFFFA97A)))
    Species.CAT -> Brush.linearGradient(listOf(Color(0xFFD7E8FF), Color(0xFF9DBEF0)))
    Species.RABBIT -> Brush.linearGradient(listOf(Color(0xFFF7D9F0), Color(0xFFE3A5D3)))
    Species.BIRD -> Brush.linearGradient(listOf(Color(0xFFDDF5D6), Color(0xFFA3D99A)))
    Species.OTHER -> Brush.linearGradient(listOf(Color(0xFFEDE3D6), Color(0xFFCDB89E)))
}

/** The pet's photo, or a friendly species placeholder when no photo was added. */
@Composable
fun PetImage(pet: Pet, modifier: Modifier = Modifier, emojiSize: Dp = 56.dp) {
    if (pet.imagePath != null) {
        AsyncImage(
            model = File(pet.imagePath),
            contentDescription = pet.name,
            contentScale = ContentScale.Crop,
            modifier = modifier,
        )
    } else {
        Box(modifier.background(speciesGradient(pet.species)), contentAlignment = Alignment.Center) {
            Text(pet.species.emoji, fontSize = emojiSize.value.sp)
        }
    }
}

@Composable
fun PetCard(pet: Pet, onClick: () -> Unit, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.fillMaxWidth().clickable(onClick = onClick),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
    ) {
        Row(Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            PetImage(
                pet = pet,
                modifier = Modifier.size(88.dp).clip(RoundedCornerShape(16.dp)),
                emojiSize = 40.dp,
            )
            Spacer(Modifier.width(14.dp))
            Column(Modifier.weight(1f)) {
                Text(pet.name, style = MaterialTheme.typography.titleMedium)
                Text(
                    "${pet.species.label} · ${pet.breed} · ${pet.age}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                Spacer(Modifier.height(6.dp))
                AreaLabel(pet.area)
            }
        }
    }
}

/** Compact card used in horizontal carousels. */
@Composable
fun PetTile(pet: Pet, onClick: () -> Unit, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.width(150.dp).clickable(onClick = onClick),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
    ) {
        PetImage(pet, Modifier.fillMaxWidth().height(120.dp), emojiSize = 48.dp)
        Column(Modifier.padding(10.dp)) {
            Text(pet.name, style = MaterialTheme.typography.titleMedium, maxLines = 1)
            AreaLabel(pet.area)
        }
    }
}

@Composable
fun AreaLabel(area: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(
            Icons.Filled.LocationOn,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(16.dp),
        )
        Spacer(Modifier.width(2.dp))
        Text(
            "$area, Kolkata",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
    }
}

@Composable
fun InfoPill(text: String, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(50),
        color = MaterialTheme.colorScheme.secondaryContainer,
        contentColor = MaterialTheme.colorScheme.onSecondaryContainer,
    ) {
        Text(text, Modifier.padding(horizontal = 12.dp, vertical = 6.dp), style = MaterialTheme.typography.labelLarge)
    }
}

@Composable
fun ScreenHeader(title: String, subtitle: String? = null, modifier: Modifier = Modifier) {
    Column(modifier.padding(horizontal = 20.dp, vertical = 16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(title, style = MaterialTheme.typography.headlineMedium)
        if (subtitle != null) {
            Text(subtitle, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
