# Android Bus Location (auto-start)

App Android dedicado para enviar coordenadas do celular ao seu servidor WebSocket sem precisar clicar em botão.

## Onde configurar

Edite o arquivo:

- `app/src/main/java/br/furg/buslocation/AppConfig.kt`

Campos principais:

- `WS_URL`: URL pública do túnel (`wss://...`)
- `BUS_ID`: id do ônibus no mapa (`interno`)
- `AUTH_TOKEN`: opcional para autenticação futura
- `LOCATION_INTERVAL_MS`: intervalo de envio

## Comportamento

- Ao abrir o app: pede permissões e inicia rastreamento automaticamente.
- Após conceder permissões: inicia `Foreground Service` e envia GPS continuamente.
- Após reiniciar o celular: tenta iniciar automaticamente (receiver de boot).

## Permissões usadas

- Localização (precisa ser concedida)
- Localização em segundo plano (Android 10+)
- Notificações (Android 13+)
- Inicialização no boot

## Build (Android Studio)

1. Abra a pasta `android-bus-location` no Android Studio.
2. Aguarde sincronização do Gradle.
3. Conecte o celular via USB (depuração ativa).
4. Execute o app.
5. Conceda todas as permissões quando solicitado.

## Importante

- Sem `WS_URL` válido, o app não consegue enviar localização.
- `zrok` apenas expõe seu servidor; quem coleta GPS é este app.
- Para produção, prefira `wss://` e adicione validação de token no servidor.
