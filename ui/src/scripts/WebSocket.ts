import {WebsocketBuilder} from 'websocket-ts';
import {getCookie, setCookie} from "typescript-cookie";
import {APP_CONFIG} from "./Config"

export function BuildWebSocket() : SendMessage{
    let ws = new WebsocketBuilder(APP_CONFIG.WebSocketAddress)
        .onOpen((i, ev) => {
            console.log("websocket open!",ev)
            let sessionIDCookie : string | undefined = getCookie("session_id")
            let sessionID: string = sessionIDCookie ? sessionIDCookie : ""
            i.send(sessionID)
        })
        .onClose((i, ev) => { console.log("closed:",ev) })
        .onError((i, ev) => { console.log("error:",ev) })
        .onMessage((i, ev) => {
            let parsed = JSON.parse(ev.data)
            let header = parsed["header"]
            let body = parsed["body"]
            if(header === "SessionID"){
                setCookie("session_id",
                    body["sessionID"],
                    {expires:1,
                        sameSite:'Strict',
                        secure: APP_CONFIG.WebSocketIsSecure,
                        domain:`.${window.location.hostname}`,
                        HostOnly:false})
                return
            }
            console.log("received message!", body)
            let event = new CustomEvent(header,
                {bubbles:true,
                    cancelable:false,
                    composed:true,
                    detail:body
                })
            document.dispatchEvent(event)
        })
        .onRetry((i, ev) => { console.log("retrying:",ev) })
        .build();
    return (Header, Body) => ws.send(JSON.stringify({Header:Header,Body:Body}))
}

export type SendMessage = (Header:string, Body?:any) => void