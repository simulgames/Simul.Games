import IconButton from "@mui/material/IconButton";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import {themePreference} from "../theme/ThemePreference";

type Props = {currentTheme:themePreference,setTheme:(theme:themePreference)=>void}

export const ThemeToggleButton = (props:Props) => {
    function togglePreference(){
        let newTheme = props.currentTheme === themePreference.light ? themePreference.dark : themePreference.light
        props.setTheme(newTheme)
    }
    return <IconButton
        sx={{color: "white"}}
        onClick={togglePreference}>
        {props.currentTheme === themePreference.light ? <LightModeRoundedIcon/> : <DarkModeRoundedIcon/>}
    </IconButton>
}