package org.mollysanimalsanctuary.app.ui.screens

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddAPhoto
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import org.mollysanimalsanctuary.app.data.Gender
import org.mollysanimalsanctuary.app.data.KolkataAreas
import org.mollysanimalsanctuary.app.data.Pet
import org.mollysanimalsanctuary.app.data.Species
import org.mollysanimalsanctuary.app.ui.SanctuaryViewModel
import org.mollysanimalsanctuary.app.ui.components.DropdownField
import org.mollysanimalsanctuary.app.ui.components.ScreenHeader
import org.mollysanimalsanctuary.app.ui.components.isValidIndianMobile

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RehomeScreen(viewModel: SanctuaryViewModel, onListed: (String) -> Unit) {
    val profile by viewModel.profile.collectAsStateWithLifecycle()

    var photo by rememberSaveable { mutableStateOf<Uri?>(null) }
    var name by rememberSaveable { mutableStateOf("") }
    var species by rememberSaveable { mutableStateOf(Species.DOG) }
    var breed by rememberSaveable { mutableStateOf("") }
    var age by rememberSaveable { mutableStateOf("") }
    var gender by rememberSaveable { mutableStateOf(Gender.MALE) }
    var area by rememberSaveable { mutableStateOf<String?>(null) }
    var description by rememberSaveable { mutableStateOf("") }
    var vaccinated by rememberSaveable { mutableStateOf(false) }
    var sterilized by rememberSaveable { mutableStateOf(false) }
    var ownerName by rememberSaveable { mutableStateOf("") }
    var ownerPhone by rememberSaveable { mutableStateOf("") }
    var showErrors by rememberSaveable { mutableStateOf(false) }
    var saving by rememberSaveable { mutableStateOf(false) }

    // Pre-fill contact details from the profile.
    LaunchedEffect(profile) {
        if (ownerName.isBlank()) ownerName = profile.name
        if (ownerPhone.isBlank()) ownerPhone = profile.phone
        if (area == null && profile.area.isNotBlank()) area = profile.area
    }

    val pickPhoto = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri != null) photo = uri
    }

    val nameError = name.isBlank()
    val areaError = area == null
    val ownerNameError = ownerName.isBlank()
    val phoneError = !isValidIndianMobile(ownerPhone)

    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .imePadding(),
    ) {
        ScreenHeader(
            "Rehome a Pet",
            "Donate your pet to a loving new family. Add a photo and a few details and we'll show them to adopters across Kolkata.",
        )

        Column(Modifier.padding(horizontal = 20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .clickable {
                        pickPhoto.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
                    },
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surfaceVariant,
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
            ) {
                if (photo != null) {
                    AsyncImage(
                        model = photo,
                        contentDescription = "Pet photo",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize(),
                    )
                } else {
                    Box(contentAlignment = Alignment.Center) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Filled.AddAPhoto, contentDescription = null, modifier = Modifier.size(40.dp))
                            Spacer(Modifier.height(8.dp))
                            Text("Add your pet's photo", style = MaterialTheme.typography.titleMedium)
                            Text("Tap to choose from gallery", style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }

            SectionTitle("Pet details")
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Pet's name *") },
                isError = showErrors && nameError,
                singleLine = true,
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words),
                modifier = Modifier.fillMaxWidth(),
            )
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                Species.entries.take(3).forEach { s ->
                    FilterChip(selected = species == s, onClick = { species = s }, label = { Text("${s.emoji} ${s.label}") })
                }
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                Species.entries.drop(3).forEach { s ->
                    FilterChip(selected = species == s, onClick = { species = s }, label = { Text("${s.emoji} ${s.label}") })
                }
            }
            OutlinedTextField(
                value = breed,
                onValueChange = { breed = it },
                label = { Text("Breed (e.g. Indie, Labrador)") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
            )
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = age,
                    onValueChange = { age = it },
                    label = { Text("Age (e.g. 2 years)") },
                    singleLine = true,
                    modifier = Modifier.weight(1f),
                )
                DropdownField(
                    label = "Gender",
                    options = Gender.entries,
                    selected = gender,
                    optionLabel = { it.label },
                    onSelected = { gender = it },
                    modifier = Modifier.weight(1f),
                )
            }
            DropdownField(
                label = "Area in Kolkata *",
                options = KolkataAreas.all,
                selected = area,
                optionLabel = { it },
                onSelected = { area = it },
                isError = showErrors && areaError,
                modifier = Modifier.fillMaxWidth(),
            )
            SwitchRow("Vaccinated", vaccinated) { vaccinated = it }
            SwitchRow("Sterilized / neutered", sterilized) { sterilized = it }
            OutlinedTextField(
                value = description,
                onValueChange = { description = it },
                label = { Text("Tell adopters about your pet") },
                placeholder = { Text("Temperament, habits, food, why you're rehoming…") },
                minLines = 3,
                modifier = Modifier.fillMaxWidth(),
            )

            SectionTitle("Your contact details")
            OutlinedTextField(
                value = ownerName,
                onValueChange = { ownerName = it },
                label = { Text("Your name *") },
                isError = showErrors && ownerNameError,
                singleLine = true,
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words),
                modifier = Modifier.fillMaxWidth(),
            )
            OutlinedTextField(
                value = ownerPhone,
                onValueChange = { ownerPhone = it.filter { c -> c.isDigit() }.take(10) },
                label = { Text("Mobile number *") },
                prefix = { Text("+91 ") },
                isError = showErrors && phoneError,
                supportingText = if (showErrors && phoneError) {
                    { Text("Enter a valid 10-digit mobile number") }
                } else null,
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                modifier = Modifier.fillMaxWidth(),
            )

            Button(
                onClick = {
                    showErrors = true
                    if (nameError || areaError || ownerNameError || phoneError || saving) return@Button
                    saving = true
                    val pet = Pet(
                        id = "",
                        name = name.trim(),
                        species = species,
                        breed = breed.trim(),
                        age = age.trim(),
                        gender = gender,
                        area = area!!,
                        description = description.trim(),
                        vaccinated = vaccinated,
                        sterilized = sterilized,
                        ownerName = ownerName.trim(),
                        ownerPhone = ownerPhone.filter { it.isDigit() }.takeLast(10),
                    )
                    viewModel.listPet(pet, photo) { saved ->
                        saving = false
                        showErrors = false
                        photo = null; name = ""; breed = ""; age = ""; description = ""
                        vaccinated = false; sterilized = false
                        onListed(saved.id)
                    }
                },
                enabled = !saving,
                modifier = Modifier.fillMaxWidth().height(52.dp),
            ) {
                if (saving) {
                    CircularProgressIndicator(Modifier.size(22.dp), strokeWidth = 2.dp)
                } else {
                    Text("List my pet for adoption")
                }
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}

@Composable
private fun SectionTitle(text: String) {
    Text(text, style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(top = 4.dp))
}

@Composable
private fun SwitchRow(label: String, checked: Boolean, onChange: (Boolean) -> Unit) {
    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Text(label, style = MaterialTheme.typography.bodyLarge, modifier = Modifier.weight(1f))
        Switch(checked = checked, onCheckedChange = onChange)
    }
}
