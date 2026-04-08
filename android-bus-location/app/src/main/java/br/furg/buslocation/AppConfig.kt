package br.furg.buslocation

object AppConfig {
    // Troque para o endpoint publico do seu tunel (zrok/cloudflare), sempre com wss:// em producao.
    const val WS_URL = "wss://mapafurg.onrender.com/"

    // Mesmo ID que o seu front espera no mapa.
    const val BUS_ID = "interno"

    // Opcional: use se quiser validar origem no servidor.
    const val AUTH_TOKEN = "SEU_TOKEN_FORTE"

    const val LOCATION_INTERVAL_MS = 3_000L
    const val LOCATION_FASTEST_INTERVAL_MS = 2_000L
    const val NOTIFICATION_ID = 1001
    const val NOTIFICATION_CHANNEL_ID = "bus_location_channel"
}
