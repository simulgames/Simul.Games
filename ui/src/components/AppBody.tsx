import {Route, Routes, useNavigate} from "react-router-dom";
import {Play} from "./play-tab/Play";
import {Host} from "./Host";
import {Error404} from "./404";
import React, {useEffect} from "react";
import {ConnectionState, SendMessage} from "../props/WebSockets";


type Props = {send:SendMessage,
    state:ConnectionState
    inLobby:boolean
};

export const AppBody = (props:Props) => {

    const nav = useNavigate()

    useEffect( () =>{
        if(props.inLobby){
            nav("/")
        }
    },[nav, props.inLobby])

    return <Routes>
        <Route path="/" element={<Play inLobby={props.inLobby} send={props.send} state={props.state}/>}/>
        <Route path="/host" element={<Host send={props.send} state={props.state}/>}/>
        <Route path="*" element={<Error404/>}/>
    </Routes>
}