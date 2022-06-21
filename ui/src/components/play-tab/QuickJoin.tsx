import '../Main-tab.scss'
import Button from '@mui/material/Button';
import ConnectWithoutContactRoundedIcon from '@mui/icons-material/ConnectWithoutContactRounded';
import {TextField} from "@mui/material";
import Paper from '@mui/material/Paper';
import * as React from 'react'
import {ChangeEvent, useCallback, useEffect} from 'react'
import {Link} from "react-router-dom";
import {ConnectionState, SendMessage} from "../../props/WebSockets";

type Props = {send:SendMessage,state:ConnectionState};

export const QuickJoin = (props:Props) => {

    const [lobbyCode,setLobbyCode] = React.useState("")
    const [playerName,setPlayerName] = React.useState("")
    const [codeQueried,setCodeQueried] = React.useState("")
    const [validCode,setValidCode] = React.useState(false)
    const [lobbyStatus,setLobbyStatus] = React.useState("")

    const sendMsg = props.send

    const onLobbyFound = useCallback((e:Event) => {
        let msg = (e as CustomEvent).detail
        let queriedCode = msg["lobby"]
        setCodeQueried(queriedCode)
        setLobbyStatus(msg["status"])
        setValidCode(true)
    },[])

    const onLobbyNotFound = useCallback((e:Event) => {
        let msg = (e as CustomEvent).detail
        let queriedCode = msg["lobby"]
        setCodeQueried(queriedCode)
        setValidCode(false)
    },[])

    useEffect(() => {
        document.addEventListener("LobbyFound",onLobbyFound)
        document.addEventListener("LobbyNotFound",onLobbyNotFound)
        return () => {
            document.removeEventListener("LobbyFound",onLobbyFound)
            document.removeEventListener("LobbyNotFound",onLobbyNotFound)
        }
    },[onLobbyFound, onLobbyNotFound])



    function queryLobbyCode(e:ChangeEvent<HTMLInputElement>){
        setLobbyCode(e.target.value)
        if(e.target.value !== codeQueried){
            setValidCode(false)
        }
        if(e.target.value.length === 6){
            sendMsg({Header: "GetLobbyDataExternal", Body:{code: e.target.value}})
        }
    }

    function isCompleteLobbyCode() {
        return lobbyCode.length === 6;
    }

    function hasReceivedResponse(){
        return codeQueried === lobbyCode
    }

    function showRoomCodeError() {
        return isCompleteLobbyCode() && ((props.state === ConnectionState.CLOSED) || (hasReceivedResponse() && !validCode));
    }

    function getHelperText(){
        if(showRoomCodeError()){
            return props.state === ConnectionState.CLOSED ? "No internet connection" : "Lobby Not Found!"
        }
        if(validCode){
            return lobbyStatus
        }
        return " "
    }


    function isReadyToJoin() {
        return validCode && playerName.length > 0
    }

    const sendJoinRequest = useCallback(()=>{
        console.log("sending request to join!")
        sendMsg({Header: "JoinLobby",Body:{code: codeQueried,Name:playerName}})
    },[codeQueried, playerName, sendMsg])

    return <Paper className="main-tab"
                      component="form"
                      noValidate
                      autoComplete="off">
            <TextField
                error={showRoomCodeError()}
                helperText={getHelperText()}
                variant="outlined"
                label="LOBBY CODE"
                color={validCode ? "success" : "primary"}
                focused={validCode ? true : undefined}
                type="tel"
                onKeyPress={e => {
                    if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
                onChange={queryLobbyCode}
                inputProps={
                    {
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        maxLength: 6,
                    }}/>
            <TextField
                variant="outlined"
                label="YOUR NAME"
                helperText=" "
                onChange={e => setPlayerName(e.target.value)}
                inputProps={{
                    maxLength: 10,
                    style: {textTransform: "uppercase"}
                }}/>
            <Button className="big-button"
                    variant="contained"
                    endIcon={<ConnectWithoutContactRoundedIcon/>}
                    disabled={!isReadyToJoin()}
                    onClick={sendJoinRequest}>
                Join
            </Button>
            <p className="main-tab-text">By pressing JOIN you agree to our <Link to="/tos">Terms of Service</Link></p>
        </Paper>
}

export default QuickJoin