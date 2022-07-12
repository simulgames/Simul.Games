const envAddress = import.meta.env.VITE_WEBSOCKET_ADDRESS
export const APP_CONFIG = {
    WebSocketIsSecure: import.meta.env.VITE_IS_SECURE === "true",
    WebSocketAddress: envAddress ? envAddress : "",
}
