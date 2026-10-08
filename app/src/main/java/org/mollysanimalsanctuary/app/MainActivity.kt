package org.mollysanimalsanctuary.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import org.mollysanimalsanctuary.app.ui.SanctuaryApp
import org.mollysanimalsanctuary.app.ui.theme.MollysTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MollysTheme {
                SanctuaryApp()
            }
        }
    }
}
