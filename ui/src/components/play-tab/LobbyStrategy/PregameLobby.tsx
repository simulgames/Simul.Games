import "./Lobby.scss"
import Paper from '@mui/material/Paper'
import Divider from "@mui/material/Divider";
import Button, {ButtonProps} from "@mui/material/Button";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import * as React from "react";
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import KeyOffRoundedIcon from '@mui/icons-material/KeyOffRounded';
import LocalPoliceRoundedIcon from '@mui/icons-material/LocalPoliceRounded';
import {Member} from "../Member";
import {SendJsonMessage} from "react-use-websocket/src/lib/types";
import {useCallback, useState} from "react";
import {styled} from "@mui/material/styles";

type Props = {
    send:SendJsonMessage,
    members : {[id:string]:Member}
    lobbyName : string
    gameSelected : string
    lobbyCode : string
    hostID : string
    clientID: string};

const LobbyCodeButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color : theme.palette.text.primary,
    fontFamily: "monospace, monospace",
    fontWeight: "bolder",
    paddingTop:"0",
    paddingBottom:"0",
    height:"1rem"
}))

const MemberIconDefault = styled(AccountCircleRoundedIcon)(({}) => ({
    stroke: "black",
    strokeWidth:"1.5%",
    width:"100%",
    height:"100%"
}))

export const PregameLobby = (props:Props) => {

    const [showKey,setShowKey] = useState(true)

    const getFormattedLobbyCode = useCallback( () => {
        if(showKey){
            return `${props.lobbyCode.substring(0,3)}-${props.lobbyCode.substring(3)}`
        }
        return "•••-•••"
    },[showKey,props.lobbyCode])

    function DisplayLobbyCode(){
        return <div className="lobby-code">
            <LobbyCodeButton
                    onClick={()=>setShowKey(!showKey)}
                    startIcon={showKey ? <KeyRoundedIcon/> : <KeyOffRoundedIcon/>}>
                {getFormattedLobbyCode()}
            </LobbyCodeButton>
        </div>
        }


    function getMember(member:Member,id:string){
        let fontWeight = (id === props.clientID) ? "bolder" : ""
        return <li className="lobby-member" key = {id}>
            <div className="member-icon-box">
                <MemberIconDefault sx={{color:member.color}}/>
                {props.hostID === id ? <LocalPoliceRoundedIcon className="host-status"/> : ""}
            </div>
            <span className="member-text" style={{fontWeight:fontWeight}}>{member.name}</span>
        </li>
    }

    function getMembers(){
        let memberComponents = [];
        for(let memberId in props.members){
            let member = props.members[memberId]
            memberComponents.push(getMember(member,memberId))
        }
        return <ul className="lobby-members">{memberComponents}</ul>
    }

    function LeaveLobby(){
        props.send({Header:"LeaveLobby"})
    }

    function StartGame(){
        props.send({Header:"StartGame"})
    }

    return <Paper className="main-tab">
        <h1 className="lobby-name">{props.lobbyName}</h1>
        <span className="subheader">
            {DisplayLobbyCode()}
            <span className="playing-game">Playing <i>{props.gameSelected}</i></span>
        </span>
        <Divider/>
        {getMembers()}
        <Divider/>
        <div className="main-tab-footer">
            <Button className="tiny-button"
                    variant="contained"
                    endIcon={<LogoutIcon/>}
                    onClick={LeaveLobby}>
                Leave
            </Button>
            <Button className="tiny-button"
                    variant="contained"
                    endIcon={<PlayArrowRoundedIcon/>}
                    disabled={props.hostID !== props.clientID}
                    onClick={StartGame}>
                Start
            </Button>
        </div>
    </Paper>
}