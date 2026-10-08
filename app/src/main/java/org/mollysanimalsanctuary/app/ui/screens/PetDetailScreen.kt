package org.mollysanimalsanctuary.app.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import org.mollysanimalsanctuary.app.ui.SanctuaryViewModel
import org.mollysanimalsanctuary.app.ui.components.AreaLabel
import org.mollysanimalsanctuary.app.ui.components.InfoPill
import org.mollysanimalsanctuary.app.ui.components.PetImage

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun PetDetailScreen(
    viewModel: SanctuaryViewModel,
    petId: String,
    onBack: () -> Unit,
    onOpenProfile: () -> Unit,
) {
    val allPets by viewModel.allPets.collectAsStateWithLifecycle()
    val profile by viewModel.profile.collectAsStateWithLifecycle()
    val requests by viewModel.adoptionRequests.collectAsStateWithLifecycle()
    val pet = allPets.firstOrNull { it.id == petId }
    val context = LocalContext.current

    var dialog by remember { mutableStateOf<DetailDialog?>(null) }

    if (pet == null) {
        Column(Modifier.fillMaxSize().padding(24.dp)) {
            Text("This pet is no longer listed.", style = MaterialTheme.typography.titleMedium)
            TextButton(onClick = onBack) { Text("Go back") }
        }
        return
    }

    val requested = pet.id in requests

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        Box {
            PetImage(pet, Modifier.fillMaxWidth().height(300.dp), emojiSize = 120.dp)
            FilledTonalIconButton(
                onClick = onBack,
                modifier = Modifier.padding(12.dp),
                shape = CircleShape,
                colors = IconButtonDefaults.filledTonalIconButtonColors(
                    containerColor = MaterialTheme.colorScheme.surface.copy(alpha = 0.85f),
                ),
            ) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
            }
        }

        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(pet.name, style = MaterialTheme.typography.headlineLarge)
            AreaLabel(pet.area)

            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                InfoPill("${pet.species.emoji} ${pet.species.label}")
                if (pet.breed.isNotBlank()) InfoPill(pet.breed)
                if (pet.age.isNotBlank()) InfoPill(pet.age)
                InfoPill(pet.gender.label)
                InfoPill(if (pet.vaccinated) "Vaccinated" else "Not vaccinated")
                InfoPill(if (pet.sterilized) "Sterilized" else "Not sterilized")
            }

            if (pet.description.isNotBlank()) {
                Text("About ${pet.name}", style = MaterialTheme.typography.titleMedium)
                Text(pet.description, style = MaterialTheme.typography.bodyLarge)
            }

            Card(Modifier.fillMaxWidth()) {
                Row(Modifier.padding(16.dp)) {
                    Column(Modifier.weight(1f)) {
                        Text("Listed by", style = MaterialTheme.typography.labelMedium)
                        Text(if (pet.listedByMe) "You" else pet.ownerName, style = MaterialTheme.typography.titleMedium)
                        Text(pet.ownerPhone, style = MaterialTheme.typography.bodyMedium)
                    }
                    if (!pet.listedByMe && pet.ownerPhone.isNotBlank()) {
                        FilledTonalIconButton(onClick = {
                            context.startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:${pet.ownerPhone}")))
                        }) {
                            Icon(Icons.Filled.Phone, contentDescription = "Call ${pet.ownerName}")
                        }
                    }
                }
            }

            Spacer(Modifier.height(4.dp))
            when {
                pet.listedByMe -> OutlinedButton(
                    onClick = { dialog = DetailDialog.ConfirmRemove },
                    modifier = Modifier.fillMaxWidth(),
                ) { Text("Remove my listing") }

                requested -> OutlinedButton(onClick = {}, enabled = false, modifier = Modifier.fillMaxWidth()) {
                    Icon(Icons.Filled.CheckCircle, contentDescription = null)
                    Spacer(Modifier.width(8.dp))
                    Text("Adoption request sent")
                }

                else -> Button(
                    onClick = {
                        dialog = if (profile.isComplete) DetailDialog.ConfirmAdopt else DetailDialog.NeedProfile
                    },
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                ) { Text("I want to adopt ${pet.name}") }
            }
        }
    }

    when (dialog) {
        DetailDialog.NeedProfile -> AlertDialog(
            onDismissRequest = { dialog = null },
            title = { Text("Complete your profile") },
            text = { Text("Add your name and mobile number so ${pet.ownerName} can contact you about ${pet.name}.") },
            confirmButton = {
                TextButton(onClick = { dialog = null; onOpenProfile() }) { Text("Go to profile") }
            },
            dismissButton = { TextButton(onClick = { dialog = null }) { Text("Cancel") } },
        )

        DetailDialog.ConfirmAdopt -> AlertDialog(
            onDismissRequest = { dialog = null },
            title = { Text("Adopt ${pet.name}?") },
            text = {
                Text("We'll share your details (${profile.name}, ${profile.phone}) with ${pet.ownerName}. They'll get in touch to arrange a meet-up.")
            },
            confirmButton = {
                TextButton(onClick = {
                    viewModel.requestAdoption(pet.id)
                    dialog = DetailDialog.Sent
                }) { Text("Send request") }
            },
            dismissButton = { TextButton(onClick = { dialog = null }) { Text("Cancel") } },
        )

        DetailDialog.Sent -> AlertDialog(
            onDismissRequest = { dialog = null },
            title = { Text("Request sent 🎉") },
            text = { Text("Thank you for choosing to adopt! You can also call ${pet.ownerName} directly at ${pet.ownerPhone}.") },
            confirmButton = { TextButton(onClick = { dialog = null }) { Text("OK") } },
        )

        DetailDialog.ConfirmRemove -> AlertDialog(
            onDismissRequest = { dialog = null },
            title = { Text("Remove ${pet.name}?") },
            text = { Text("${pet.name} will no longer be shown to people looking to adopt.") },
            confirmButton = {
                TextButton(onClick = {
                    dialog = null
                    onBack()
                    viewModel.removePet(pet.id)
                }) { Text("Remove") }
            },
            dismissButton = { TextButton(onClick = { dialog = null }) { Text("Cancel") } },
        )

        null -> Unit
    }
}

private enum class DetailDialog { NeedProfile, ConfirmAdopt, Sent, ConfirmRemove }
