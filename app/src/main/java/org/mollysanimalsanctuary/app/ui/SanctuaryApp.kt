package org.mollysanimalsanctuary.app.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Pets
import androidx.compose.material.icons.filled.VolunteerActivism
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import org.mollysanimalsanctuary.app.ui.screens.AdoptScreen
import org.mollysanimalsanctuary.app.ui.screens.HomeScreen
import org.mollysanimalsanctuary.app.ui.screens.PetDetailScreen
import org.mollysanimalsanctuary.app.ui.screens.ProfileScreen
import org.mollysanimalsanctuary.app.ui.screens.RehomeScreen

object Routes {
    const val HOME = "home"
    const val ADOPT = "adopt"
    const val REHOME = "rehome"
    const val PROFILE = "profile"
    const val PET = "pet/{petId}"
    fun pet(id: String) = "pet/$id"
}

private data class Tab(val route: String, val label: String, val icon: ImageVector)

private val tabs = listOf(
    Tab(Routes.HOME, "Home", Icons.Filled.Home),
    Tab(Routes.ADOPT, "Adopt", Icons.Filled.Pets),
    Tab(Routes.REHOME, "Rehome", Icons.Filled.VolunteerActivism),
    Tab(Routes.PROFILE, "Profile", Icons.Filled.Person),
)

@Composable
fun SanctuaryApp(viewModel: SanctuaryViewModel = viewModel()) {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route
    val showBottomBar = tabs.any { it.route == currentRoute }

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                NavigationBar {
                    tabs.forEach { tab ->
                        NavigationBarItem(
                            selected = currentRoute == tab.route,
                            onClick = { navController.navigateToTab(tab.route) },
                            icon = { Icon(tab.icon, contentDescription = null) },
                            label = { Text(tab.label) },
                        )
                    }
                }
            }
        },
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = Routes.HOME,
            modifier = Modifier.padding(padding),
        ) {
            composable(Routes.HOME) {
                HomeScreen(
                    viewModel = viewModel,
                    onAdopt = { navController.navigateToTab(Routes.ADOPT) },
                    onRehome = { navController.navigateToTab(Routes.REHOME) },
                    onAreaSelected = { area ->
                        viewModel.setAreaFilter(area)
                        navController.navigateToTab(Routes.ADOPT)
                    },
                    onPetClick = { navController.navigate(Routes.pet(it)) },
                )
            }
            composable(Routes.ADOPT) {
                AdoptScreen(
                    viewModel = viewModel,
                    onPetClick = { navController.navigate(Routes.pet(it)) },
                )
            }
            composable(Routes.REHOME) {
                RehomeScreen(
                    viewModel = viewModel,
                    onListed = { navController.navigate(Routes.pet(it)) },
                )
            }
            composable(Routes.PROFILE) {
                ProfileScreen(
                    viewModel = viewModel,
                    onPetClick = { navController.navigate(Routes.pet(it)) },
                )
            }
            composable(
                Routes.PET,
                arguments = listOf(navArgument("petId") { type = NavType.StringType }),
            ) { entry ->
                PetDetailScreen(
                    viewModel = viewModel,
                    petId = entry.arguments?.getString("petId").orEmpty(),
                    onBack = { navController.popBackStack() },
                    onOpenProfile = { navController.navigateToTab(Routes.PROFILE) },
                )
            }
        }
    }
}

private fun NavHostController.navigateToTab(route: String) {
    navigate(route) {
        popUpTo(graph.findStartDestination().id) { saveState = true }
        launchSingleTop = true
        restoreState = true
    }
}
