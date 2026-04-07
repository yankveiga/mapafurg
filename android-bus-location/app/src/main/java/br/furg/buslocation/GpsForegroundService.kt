package br.furg.buslocation

import android.Manifest
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority

class GpsForegroundService : Service() {
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private val socketClient = LocationSocketClient()

    private val locationCallback = object : LocationCallback() {
        override fun onLocationResult(locationResult: LocationResult) {
            val location = locationResult.lastLocation ?: return
            socketClient.sendLocation(
                latitude = location.latitude,
                longitude = location.longitude,
                speed = if (location.hasSpeed()) location.speed else null,
                accuracy = if (location.hasAccuracy()) location.accuracy else null,
                heading = if (location.hasBearing()) location.bearing else null
            )
        }
    }

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        createNotificationChannel()
        startForeground(AppConfig.NOTIFICATION_ID, buildNotification())
        socketClient.connect()
        startLocationUpdates()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        fusedLocationClient.removeLocationUpdates(locationCallback)
        socketClient.close()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun startLocationUpdates() {
        if (!hasLocationPermission(this)) return

        val request = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, AppConfig.LOCATION_INTERVAL_MS)
            .setMinUpdateIntervalMillis(AppConfig.LOCATION_FASTEST_INTERVAL_MS)
            .build()

        fusedLocationClient.requestLocationUpdates(request, locationCallback, mainLooper)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                AppConfig.NOTIFICATION_CHANNEL_ID,
                "Rastreamento do Onibus",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        return NotificationCompat.Builder(this, AppConfig.NOTIFICATION_CHANNEL_ID)
            .setContentTitle("Onibus em rastreamento")
            .setContentText("Enviando localizacao em tempo real")
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setOngoing(true)
            .build()
    }

    companion object {
        fun start(context: Context) {
            val intent = Intent(context, GpsForegroundService::class.java)
            ContextCompat.startForegroundService(context, intent)
        }

        fun hasLocationPermission(context: Context): Boolean {
            val fine = ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED

            val coarse = ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED

            return fine || coarse
        }
    }
}
