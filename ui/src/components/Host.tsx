import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './Main-tab.scss'
import * as React from 'react'
import {SyntheticEvent} from 'react'
import Checkbox from '@mui/material/Checkbox';
import {FormControlLabel, FormGroup} from "@mui/material";
import Button from "@mui/material/Button";
import EmojiPeopleRoundedIcon from '@mui/icons-material/EmojiPeopleRounded';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import {Link} from "react-router-dom";
import {ConnectionState, SendMessage} from "../props/WebSockets";

type Props = {state:ConnectionState,send:SendMessage};

export const Host = (props:Props) => {

    const [hostName,setHostName] = React.useState("")
    const [gameSelected,setGameSelected] = React.useState("")
    const [awaitingReply,setAwaitingReply] = React.useState(false)

    function getHelperText(){
        return <span className="main-tab-text">More games coming soon, visit <Link to='/about'>About</Link>!</span>
    }

    function hostGame(){
        if(!isButtonDisabled()){
            setAwaitingReply(true)
            let capitalizedHostName = hostName[0].toUpperCase() + hostName.substring(1).toLowerCase()
            let isLastLetterS = capitalizedHostName.charAt(hostName.length-1) === "s"
            let lobbyName = `${capitalizedHostName}'${isLastLetterS ? "" : "s"} Lobby`
            props.send({Header:"MakeLobby",Body:{Lobby:{name:lobbyName,Game:gameSelected},Host:{Name:hostName}}})
        }
    }

    function isButtonDisabled(){
        return (hostName === "" || gameSelected === "" || awaitingReply || (props.state === ConnectionState.CLOSED))
    }

    function setSelectedGame(event:SyntheticEvent<Element,Event>, value:string|null){
        let selected = value == null ? "" : value
        setGameSelected(selected)
    }

    return <Paper className="main-tab"
                  component="form"
                  noValidate
                  autoComplete="off">
        {props.state === ConnectionState.CLOSED ? <p className="error-msg main-tab-text">No internet connection</p> : ""}
        <TextField label="YOUR NAME" helperText=" "
                   onChange={e => setHostName(e.target.value)}
                   inputProps={{
                       maxLength: 10,
                       style: {textTransform: "uppercase"}
                   }}/>
        <Autocomplete
            autoHighlight
            onChange={(e,v)=>setSelectedGame(e,v)}
            renderInput={(params) =>
                <TextField {...params}
                           label="SELECT GAME"
                           helperText={getHelperText()}
                           />}
            options={["Word Duel"]}/>

        <FormGroup sx={{display:"inline-grid", gridTemplateColumns: "repeat(auto-fill, 10rem)", justifyContent:"space-between"}}>
            <FormControlLabel control={ <Checkbox defaultChecked disabled/>} label="Hidden Lobbies"/>
            <FormControlLabel control={ <Checkbox defaultChecked disabled/>} label="Anonymous"/>
            <FormControlLabel control={ <Checkbox disabled/>} label="Family Friendly"/>
            <FormControlLabel control={ <Checkbox disabled/>} label="Password"/>
            <FormControlLabel control={ <Checkbox disabled/>} label="Rapid"/>
            <FormControlLabel control={ <Checkbox defaultChecked disabled/>} label="Spectators"/>
        </FormGroup>
        <Button className= "big-button"
                variant="contained"
                endIcon={ awaitingReply ? <HourglassTopRoundedIcon/> : <EmojiPeopleRoundedIcon/>}
                disabled={isButtonDisabled()}
                onClick={()=>hostGame()}
        >Host</Button>
    </Paper>
}