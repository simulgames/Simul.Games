import useWebSocket, {ReadyState} from "react-use-websocket";
import {getCookie, setCookie} from "typescript-cookie";
import {useCallback} from "react";

type message = {Header:string,Body?:any}

export type SendMessage = (msg:message) => void

export enum ConnectionState {
    UNINSTANTIATED = -1,
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3
}

export const useConnection = () : [ConnectionState,SendMessage] => {

    const {REACT_APP_WEBSOCKET_ADDRESS,REACT_APP_IS_SECURE} = process.env
    const {sendMessage,readyState} = useWebSocket(
        `${REACT_APP_WEBSOCKET_ADDRESS}/`,
        {
            onOpen : (e:Event) => {
                let ws = e.currentTarget as WebSocket
                console.log("sending ID!")
                let sessionIDCookie : string | undefined = getCookie("session_id")
                let sessionID: string = sessionIDCookie ? sessionIDCookie : ""
                ws.send(sessionID)
            },
            onMessage: (message: MessageEvent) => {
                let parsed = JSON.parse(message.data)
                let header = parsed["header"]
                let body = parsed["body"]
                console.log("received message!", body)
                if(header === "SessionID"){
                    setCookie("session_id",
                        body["sessionID"],
                        {expires:1,
                            sameSite:'Strict',
                            secure: REACT_APP_IS_SECURE === "true",
                            domain:`.${window.location.hostname}`,
                            HostOnly:false})
                    return
                }
                let event = new CustomEvent(header,
                    {bubbles:true,
                        cancelable:false,
                        composed:true,
                        detail:body
                    })
                document.dispatchEvent(event)
            },
            shouldReconnect: (event:CloseEvent) => {
                console.log("disconnected: ",event);
                return true
            },
            reconnectAttempts: 40,
            reconnectInterval: 1000,
        }
            )


    const connectionStatus:ConnectionState = {
        [ReadyState.CONNECTING]: ConnectionState.CONNECTING,
        [ReadyState.OPEN]: ConnectionState.OPEN,
        [ReadyState.CLOSING]: ConnectionState.CLOSING,
        [ReadyState.CLOSED]: ConnectionState.CLOSED,
        [ReadyState.UNINSTANTIATED]: ConnectionState.UNINSTANTIATED,
    }[readyState];

    const SendJsonMessage : SendMessage = useCallback((msg:message)=>{
        sendMessage(JSON.stringify(msg))
    },[sendMessage])

    return [connectionStatus,SendJsonMessage]
}