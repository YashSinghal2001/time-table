package org.mollysanimalsanctuary.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

private val Orange = Color(0xFFE8692C)
private val DeepOrange = Color(0xFFB34A14)
private val Teal = Color(0xFF2A7F7A)
private val Cream = Color(0xFFFFF8F1)

private val LightColors = lightColorScheme(
    primary = Orange,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFFFDCC8),
    onPrimaryContainer = Color(0xFF3A1300),
    secondary = Teal,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFCDEDE9),
    onSecondaryContainer = Color(0xFF00201E),
    tertiary = DeepOrange,
    background = Cream,
    onBackground = Color(0xFF2B211B),
    surface = Cream,
    onSurface = Color(0xFF2B211B),
    surfaceVariant = Color(0xFFF5E6DA),
    onSurfaceVariant = Color(0xFF5C4D43),
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFFFFB68F),
    onPrimary = Color(0xFF552000),
    primaryContainer = Color(0xFF7A3610),
    onPrimaryContainer = Color(0xFFFFDCC8),
    secondary = Color(0xFF8FD3CD),
    onSecondary = Color(0xFF003734),
    secondaryContainer = Color(0xFF1D4F4B),
    onSecondaryContainer = Color(0xFFCDEDE9),
    tertiary = Color(0xFFFFB68F),
    background = Color(0xFF1C1714),
    onBackground = Color(0xFFEDE0D8),
    surface = Color(0xFF1C1714),
    onSurface = Color(0xFFEDE0D8),
    surfaceVariant = Color(0xFF3A2F28),
    onSurfaceVariant = Color(0xFFD7C3B6),
)

private val AppTypography = Typography().let { base ->
    base.copy(
        headlineLarge = base.headlineLarge.copy(fontWeight = FontWeight.Bold),
        headlineMedium = base.headlineMedium.copy(fontWeight = FontWeight.Bold),
        titleLarge = base.titleLarge.copy(fontWeight = FontWeight.SemiBold),
        titleMedium = TextStyle(fontSize = 17.sp, fontWeight = FontWeight.SemiBold, lineHeight = 24.sp),
    )
}

@Composable
fun MollysTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = if (isSystemInDarkTheme()) DarkColors else LightColors,
        typography = AppTypography,
        content = content,
    )
}
