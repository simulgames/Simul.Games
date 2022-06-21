import "./Header.scss"
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import IconButton from '@mui/material/IconButton';
import {HeaderTabs} from "./HeaderTabs";
import React from "react";
import AppBar from '@mui/material/AppBar';
import {themePreference} from "../theme/ThemePreference";
import {ThemeToggleButton} from "./ThemeToggleButton";
import {ConnectionState, SendMessage} from "../props/WebSockets";
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';


type Props = {send:SendMessage,
    inLobby:boolean,
    state:ConnectionState,
    currentTheme:themePreference ,
    setTheme:(them:themePreference)=>void};

export const Header = (props:Props) => {
    const [isMenuOpen, setMenu] = React.useState(false);
    function ToggleMenu(){
        setMenu(!isMenuOpen)
    }

    function rightMenuIcon(){
        if(props.inLobby){
            return <IconButton sx={{color: "white"}} onClick={() => {
                props.send({Header:"LeaveLobby"})}}>
                <ExitToAppRoundedIcon/>
            </IconButton>
        }
        else return <IconButton sx={{color: "white"}} onClick={() => {ToggleMenu()}}>
            {isMenuOpen ?<MenuOpenRoundedIcon/> : <MenuRoundedIcon/>}
        </IconButton>
    }

    return <div className="App">
            <AppBar className="page-header" position="static" sx={{background:'#183C63'}}>
                <header className="header-bar">
                    {rightMenuIcon()}
                    <div className="title">
                        <h1>simul.games</h1>
                    </div>
                    <ThemeToggleButton currentTheme={props.currentTheme} setTheme={props.setTheme}/>
                </header>
                <HeaderTabs menuOpen = {isMenuOpen && !props.inLobby}/>
            </AppBar>
            <div className="space"/>
        </div>
}