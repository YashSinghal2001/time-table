# Molly's Animal Sanctuary — Android App

Android app for [Molly's Animal Sanctuary](https://www.mollysanimalsanctuary.org) that helps pets in Kolkata find new homes. No login is needed: open the app and choose whether you want to **adopt** a pet or **rehome** (donate) your own.

## Features

- **Home**: welcome banner, two big choices (*Adopt a Pet* / *Rehome a Pet*), a carousel of pets waiting for a home, and quick "browse by area" chips for Kolkata neighbourhoods.
- **Adopt**: every animal up for adoption, filterable by animal type (dog, cat, rabbit, bird, other) and by area (Salt Lake, New Town, Park Street, Behala, and more). Tap a pet to see details, call the owner, or send an adoption request.
- **Rehome (Donate)**: owners add a photo from the gallery and basic details (name, type, breed, age, gender, area, vaccinated/sterilized, description, contact). The pet then shows up in the Adopt list right away.
- **My Profile**: name, mobile number, email and area. It's stored on the phone and pre-fills the rehome form and adoption requests. It also lists the pets you're rehoming and the pets you've asked to adopt.

All data is stored locally on the device for now (SharedPreferences + photos in app storage), so the app works fully offline. A sample set of sanctuary animals is included so the app has content for demos and pitches.

## Tech stack

- Kotlin + Jetpack Compose (Material 3)
- Navigation Compose, ViewModel + StateFlow
- Coil for images, Android Photo Picker (no storage permission needed)
- minSdk 26 (Android 8.0), targetSdk 34

## Getting started

1. Install [Android Studio](https://developer.android.com/studio) (Koala or newer).
2. Clone the repo:
   ```bash
   git clone https://github.com/YashSinghal2001/<repo-name>.git
   ```
3. In Android Studio choose **File → Open** and pick the cloned folder. Let Gradle sync finish.
4. Plug in a phone (with USB debugging on) or start an emulator, then press **Run ▶**.

Command line build:

```bash
./gradlew assembleDebug
# APK: app/build/outputs/apk/debug/app-debug.apk
```

Every push also builds a debug APK on GitHub Actions. Open the **Actions** tab, select the latest run, and download the `mollys-animal-sanctuary-debug` artifact to install it directly on a phone.

## Project structure

```
app/src/main/java/org/mollysanimalsanctuary/app/
├── MainActivity.kt
├── data/            # Pet & Profile models, sample pets, local storage repository
└── ui/
    ├── SanctuaryApp.kt        # navigation + bottom bar
    ├── SanctuaryViewModel.kt
    ├── components/            # pet cards, images, form fields
    ├── screens/               # Home, Adopt, Pet detail, Rehome, Profile
    └── theme/
```

## Next steps (ideas)

- Connect a backend (e.g. Firebase Firestore + Storage) so listings are shared between all users instead of staying on one phone.
- Phone-number OTP verification, and admin approval of new listings by the sanctuary.
- Push notifications when someone requests to adopt your pet.
