import { LinearBackoff, TimeBuffer, WebsocketBuilder } from "websocket-ts"
import { setCookie } from "typescript-cookie"
import { APP_CONFIG } from "./Config"

const builder = new WebsocketBuilder(APP_CONFIG.WebSocketAddress)
    .onOpen((i, ev) => {
        console.log("websocket open!", ev)
    })
    .onClose((i, ev) => {
        console.log("closed:", ev)
    })
    .onError((i, ev) => {
        console.log("error:", ev)
    })
    .withBuffer(new TimeBuffer(5 * 60 * 1000))
    .onMessage((i, ev) => {
        const parsed = JSON.parse(ev.data)
        const header = parsed["header"]
        const body = parsed["body"]
        if (header === "SessionID") {
            setCookie("session_id", body["sessionID"], {
                expires: 1,
                sameSite: "Strict",
                secure: APP_CONFIG.WebSocketIsSecure,
                domain: `.${window.location.hostname}`,
                HostOnly: false,
            })
            return
        }
        console.log("received message!", body)
        const event = new CustomEvent(header, {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: body,
        })
        document.dispatchEvent(event)
    })
    .withBackoff(new LinearBackoff(0, 1000, 10000))
    .onRetry((i, ev) => {
        console.log("retrying:", ev)
    })

export const SendMessage = (Header: string, Body?: Record<string, unknown>) => {
    const msg = JSON.stringify({ Header: Header, Body: Body })
    console.log(msg)
    builder.build().send(msg)
}
