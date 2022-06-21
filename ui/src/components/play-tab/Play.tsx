import QuickJoin from "./QuickJoin";
import * as React from "react";
import {useCallback} from "react";
import {Lobby} from "./Lobby";
import {ConnectionState, SendMessage} from "../../props/WebSockets";


type Props = {send:SendMessage,
    state:ConnectionState,
    inLobby:boolean,
    };

export const Play = (props:Props) => {
    const getState= useCallback(()=>{

        if(props.inLobby){
            return <Lobby send={props.send} state={props.state}/>
        }
        return <QuickJoin send={props.send} state={props.state}/>
    },[props.inLobby, props.send, props.state])

    return getState()
}