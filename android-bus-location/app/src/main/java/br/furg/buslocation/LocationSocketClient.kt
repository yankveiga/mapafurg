package br.furg.buslocation

import android.os.Handler
import android.os.Looper
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import okio.ByteString
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class LocationSocketClient {
    private val reconnectDelayMs = 5_000L
    private val reconnectHandler = Handler(Looper.getMainLooper())
    private var shouldReconnect = true

    private val client = OkHttpClient.Builder()
        .readTimeout(0, TimeUnit.MILLISECONDS)
        .pingInterval(20, TimeUnit.SECONDS)
        .build()

    @Volatile
    private var webSocket: WebSocket? = null

    @Volatile
    private var connected = false

    private val reconnectRunnable = Runnable {
        if (shouldReconnect && webSocket == null) {
            connect()
        }
    }

    fun connect() {
        shouldReconnect = true
        if (webSocket != null) return

        val request = Request.Builder().url(AppConfig.WS_URL).build()
        webSocket = client.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                connected = true
                reconnectHandler.removeCallbacks(reconnectRunnable)
            }

            override fun onMessage(webSocket: WebSocket, text: String) {}
            override fun onMessage(webSocket: WebSocket, bytes: ByteString) {}

            override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
                webSocket.close(code, reason)
                markDisconnectedAndScheduleReconnect()
            }

            override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
                markDisconnectedAndScheduleReconnect()
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                markDisconnectedAndScheduleReconnect()
            }
        })
    }

    private fun markDisconnectedAndScheduleReconnect() {
        connected = false
        webSocket = null
        if (shouldReconnect) {
            reconnectHandler.removeCallbacks(reconnectRunnable)
            reconnectHandler.postDelayed(reconnectRunnable, reconnectDelayMs)
        }
    }

    fun sendLocation(
        latitude: Double,
        longitude: Double,
        speed: Float?,
        accuracy: Float?,
        heading: Float?
    ) {
        if (webSocket == null) connect()
        if (!connected) return

        val payload = JSONObject().apply {
            put("type", "bus_location")
            put("busId", AppConfig.BUS_ID)
            put("lat", latitude)
            put("lng", longitude)
            put("timestamp", java.time.Instant.now().toString())

            speed?.let { put("speed", it) }
            accuracy?.let { put("accuracy", it) }
            heading?.let { put("heading", it) }

            if (AppConfig.AUTH_TOKEN.isNotBlank()) {
                put("token", AppConfig.AUTH_TOKEN)
            }
        }

        webSocket?.send(payload.toString())
    }

    fun close() {
        shouldReconnect = false
        reconnectHandler.removeCallbacks(reconnectRunnable)
        webSocket?.close(1000, "Encerrando")
        webSocket = null
        connected = false
    }
}
