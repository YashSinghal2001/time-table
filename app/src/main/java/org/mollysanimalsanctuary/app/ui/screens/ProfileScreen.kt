package org.mollysanimalsanctuary.app.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import kotlinx.coroutines.delay
import org.mollysanimalsanctuary.app.data.KolkataAreas
import org.mollysanimalsanctuary.app.data.Profile
import org.mollysanimalsanctuary.app.ui.SanctuaryViewModel
import org.mollysanimalsanctuary.app.ui.components.DropdownField
import org.mollysanimalsanctuary.app.ui.components.PetCard
import org.mollysanimalsanctuary.app.ui.components.ScreenHeader
import org.mollysanimalsanctuary.app.ui.components.isValidEmail
import org.mollysanimalsanctuary.app.ui.components.isValidIndianMobile

@Composable
fun ProfileScreen(viewModel: SanctuaryViewModel, onPetClick: (String) -> Unit) {
    val profile by viewModel.profile.collectAsStateWithLifecycle()
    val myPets by viewModel.myPets.collectAsStateWithLifecycle()
    val allPets by viewModel.allPets.collectAsStateWithLifecycle()
    val requests by viewModel.adoptionRequests.collectAsStateWithLifecycle()

    var name by rememberSaveable(profile) { mutableStateOf(profile.name) }
    var phone by rememberSaveable(profile) { mutableStateOf(profile.phone) }
    var email by rememberSaveable(profile) { mutableStateOf(profile.email) }
    var area by rememberSaveable(profile) { mutableStateOf(profile.area.ifBlank { null }) }
    var showErrors by rememberSaveable { mutableStateOf(false) }
    var savedMessage by rememberSaveable { mutableStateOf(false) }

    LaunchedEffect(savedMessage) {
        if (savedMessage) {
            delay(2500)
            savedMessage = false
        }
    }

    val nameError = name.isBlank()
    val phoneError = !isValidIndianMobile(phone)
    val emailError = !isValidEmail(email)
    val requestedPets = allPets.filter { it.id in requests }

    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .imePadding(),
    ) {
        ScreenHeader("My Profile", "No login needed. Your details stay on this phone and are shared only when you contact a pet owner.")

        Row(
            Modifier.padding(horizontal = 20.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                Modifier
                    .size(64.dp)
                    .background(MaterialTheme.colorScheme.primaryContainer, CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    profile.name.trim().firstOrNull()?.uppercase() ?: "🐾",
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                )
            }
            Spacer(Modifier.width(16.dp))
            Column {
                Text(profile.name.ifBlank { "Guest" }, style = MaterialTheme.typography.titleLarge)
                Text(
                    "${myPets.size} listed · ${requests.size} adoption requests",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }

        Column(
            Modifier.padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Full name *") },
                isError = showErrors && nameError,
                singleLine = true,
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words),
                modifier = Modifier.fillMaxWidth(),
            )
            OutlinedTextField(
                value = phone,
                onValueChange = { phone = it.filter { c -> c.isDigit() }.take(10) },
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
            OutlinedTextField(
                value = email,
                onValueChange = { email = it.trim() },
                label = { Text("Email") },
                isError = showErrors && emailError,
                supportingText = if (showErrors && emailError) {
                    { Text("Enter a valid email address") }
                } else null,
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                modifier = Modifier.fillMaxWidth(),
            )
            DropdownField(
                label = "Your area in Kolkata",
                options = KolkataAreas.all,
                selected = area,
                optionLabel = { it },
                onSelected = { area = it },
                modifier = Modifier.fillMaxWidth(),
            )
            Button(
                onClick = {
                    showErrors = true
                    if (nameError || phoneError || emailError) return@Button
                    viewModel.saveProfile(Profile(name.trim(), phone, email.trim(), area.orEmpty()))
                    showErrors = false
                    savedMessage = true
                },
                modifier = Modifier.fillMaxWidth().height(52.dp),
            ) { Text(if (savedMessage) "Saved ✓" else "Save profile") }

            if (myPets.isNotEmpty()) {
                Text("Pets I'm rehoming", style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(top = 12.dp))
                myPets.forEach { pet -> PetCard(pet, onClick = { onPetClick(pet.id) }) }
            }

            if (requestedPets.isNotEmpty()) {
                Text("My adoption requests", style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(top = 12.dp))
                requestedPets.forEach { pet -> PetCard(pet, onClick = { onPetClick(pet.id) }) }
            }

            Card(Modifier.fillMaxWidth().padding(top = 12.dp)) {
                Column(Modifier.padding(16.dp)) {
                    Text("About Molly's Animal Sanctuary", style = MaterialTheme.typography.titleMedium)
                    Spacer(Modifier.height(4.dp))
                    Text(
                        "We help animals in Kolkata find safe, loving homes. Visit mollysanimalsanctuary.org to learn more.",
                        style = MaterialTheme.typography.bodyMedium,
                    )
                }
            }
        }
    }
}
