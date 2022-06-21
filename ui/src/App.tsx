import {Header} from "./components/Header";
import { BrowserRouter} from 'react-router-dom'
import "./props/WebSockets";
import {useConnection} from "./props/WebSockets";
import React, {StrictMode, useEffect, useState} from "react";
import {useThemeHook} from "./theme/ThemePreference";
import {GlobalStyles, ThemeList} from "./props/ThemeList";
import {ThemeProvider} from "@mui/material";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import {AppBody} from "./components/AppBody";
import {ErrorOccurred} from "./components/ErrorOccured";
import {ErrorBoundary} from 'react-error-boundary'



export const App = () => {
    const [readyState, sendMessage] = useConnection()
    const [currentTheme,setTheme] = useThemeHook()

    const [inLobby,setInLobby] = useState(false)

    function joinedLobby(){
        setInLobby(true)
    }

    function leftLobby(){
        setInLobby(false)
    }

    function onReplied(e:Event){
        let msg = (e as CustomEvent).detail
        setInLobby(msg["inLobby"] === "true")
    }

    useEffect( () => {
        document.addEventListener("LobbyJoined",joinedLobby)
        document.addEventListener("LobbyLeft",leftLobby)
        return () => {
            document.removeEventListener("LobbyJoined",joinedLobby)
            document.removeEventListener("LobbyLeft",leftLobby)
        }
    },[])

    useEffect( () => {
        sendMessage({"Header":"UserLocation"})
        document.addEventListener("UserLocation",onReplied)
        return () => {
            document.removeEventListener("UserLocation",onReplied)
        }
    },[sendMessage])

    return <StrictMode>
        <BrowserRouter>
            <ThemeProvider theme = {ThemeList[currentTheme]}>
                <SCThemeProvider theme = {ThemeList[currentTheme]}>
                    <GlobalStyles/>
                    <Header inLobby={inLobby} state={readyState} send={sendMessage} currentTheme={currentTheme} setTheme={setTheme}/>
                    <ErrorBoundary FallbackComponent={ErrorOccurred}>
                        <AppBody inLobby={inLobby} send={sendMessage} state={readyState}/>
                    </ErrorBoundary>
                </SCThemeProvider>
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>
}

