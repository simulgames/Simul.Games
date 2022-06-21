import "./LobbyStrategy/Lobby.scss"
import * as React from "react";
import {useCallback, useEffect} from "react";
import {Loading} from "./Loading";
import {Member} from "./Member";
import {PregameLobby} from "./LobbyStrategy/PregameLobby";
import {WordDuel} from "./games/WordDuel";
import {ConnectionState, SendMessage} from "../../props/WebSockets";

type Props = {state:ConnectionState,send:SendMessage};

type MemberUpdate  = {id:string,member?:Member}

function reducer(members : {[id:string]:Member},update: MemberUpdate){
    let newMembers = {...members}
    if(update.member == null){
        delete newMembers[update.id]
    } else {
        newMembers[update.id] = update.member
    }
    return newMembers
}

export const Lobby = (props:Props) => {

    const [gotData,setGotData] = React.useState(false)
    const [gameStarted,setGameStarted] = React.useState(false)
    const [LobbyCode,setLobbyCode] = React.useState("")
    const [LobbyName,setLobbyName] = React.useState("")
    const [HostID,setHostID] = React.useState("hostID")
    const [ClientID,setClientID] = React.useState("clientID")
    const [members,updateMembers] = React.useReducer(reducer, {});

    const sendMsg = props.send

    useEffect( () =>
        {
            if(props.state === ConnectionState.OPEN){
                sendMsg({Header:"GetLobbyDataInternal"})
            }
        },[props.state, sendMsg]
    );

    const OnMemberJoined = useCallback( (e:Event) => {
        let msg = (e as CustomEvent).detail
        let newMember = {name:msg["name"],color:msg["color"]}
        updateMembers({id:msg["id"],member:newMember})
    },[])


    const OnMemberLeft = useCallback( (e:Event) => {
        let msg = (e as CustomEvent).detail
        updateMembers({id:msg["id"]})
    },[])

    const OnGameStarted = useCallback( () => {
        setGameStarted(true)
    },[])

    const OnGetLobbyData = useCallback( (e:Event) => {
        let msg = (e as CustomEvent).detail
        setGotData(true)
        let lobby = msg["lobby"]
        setLobbyCode(lobby["id"])
        setLobbyName(lobby["name"])
        document.title = `simul.games • ${lobby["name"]}`
        setClientID(msg["client-id"])
        setHostID(lobby["host-id"])
        setGameStarted(msg["has-started"])
        let lobbyMembersJson = msg["members"]
        for(let i=0;i<lobbyMembersJson.length;i++){
            let lobbyMember = lobbyMembersJson[i]
            let newMember = {name:lobbyMember["name"],color:lobbyMember["color"]}
            updateMembers({id:lobbyMember["id"],member:newMember})
        }
    },[])

    useEffect(() => {
        document.addEventListener("LobbyData",OnGetLobbyData)
        document.addEventListener("GameStarting",OnGameStarted)
        document.addEventListener("MemberJoined",OnMemberJoined)
        document.addEventListener("MemberLeft",OnMemberLeft)
        return () => {
            document.title = "simul.games • Simultaneous Games"
            document.removeEventListener("LobbyData",OnGetLobbyData)
            document.removeEventListener("GameStarting",OnGameStarted)
            document.removeEventListener("MemberJoined",OnMemberJoined)
            document.removeEventListener("MemberLeft",OnMemberLeft)
        }
    }, [OnGameStarted, OnGetLobbyData, OnMemberJoined, OnMemberLeft, props.send])


    function getPregameLobby(){
    return <PregameLobby send={props.send}
                         members={members}
                         lobbyName={LobbyName}
                         gameSelected={"Word Duel"}
                         lobbyCode={LobbyCode}
                         hostID={HostID}
                         clientID={ClientID}/>
    }

    function getLobbyStrategy(){
        if(!gameStarted){
            return getPregameLobby()
        }
        return getWordDuel()
    }

    function getWordDuel(){
        return <WordDuel
            send={props.send}
            state={props.state}
            members={members}
            hostID={HostID}
        clientID={ClientID}/>
    }

    return gotData ? getLobbyStrategy() : <Loading state={props.state}/>
}