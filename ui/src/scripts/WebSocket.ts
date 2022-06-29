import {WebsocketBuilder} from 'websocket-ts';

export function BuildWebSocket() : SendMessage{
    let envAddress = import.meta.env.VITE_WEBSOCKET_ADDRESS
    let address : string = envAddress ? envAddress : ""
    let ws = new WebsocketBuilder(address)
        .onOpen((i, ev) => { console.log("opened") })
        .onClose((i, ev) => { console.log("closed") })
        .onError((i, ev) => { console.log("error") })
        .onMessage((i, ev) => { console.log("message") })
        .onRetry((i, ev) => { console.log("retry") })
        .build();
    return (Header, Body) => ws.send(JSON.stringify({Header:Header,Body:Body}))
}

export type SendMessage = (Header:string, Body?:string) => void