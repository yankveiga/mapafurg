package br.furg.buslocation

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.TextView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    private lateinit var statusText: TextView

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) {
        if (hasRequiredPermissions()) {
            statusText.text = getString(R.string.status_running)
            GpsForegroundService.start(this)
        } else {
            statusText.text = getString(R.string.status_permissions_missing)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        statusText = findViewById(R.id.statusText)

        if (hasRequiredPermissions()) {
            statusText.text = getString(R.string.status_running)
            GpsForegroundService.start(this)
        } else {
            statusText.text = getString(R.string.status_requesting_permissions)
            permissionLauncher.launch(requiredPermissions())
        }
    }

    private fun hasRequiredPermissions(): Boolean {
        return requiredPermissions().all { permission ->
            ContextCompat.checkSelfPermission(this, permission) == PackageManager.PERMISSION_GRANTED
        }
    }

    private fun requiredPermissions(): Array<String> {
        val permissions = mutableListOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions += Manifest.permission.POST_NOTIFICATIONS
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            permissions += Manifest.permission.ACCESS_BACKGROUND_LOCATION
        }

        return permissions.toTypedArray()
    }
}
