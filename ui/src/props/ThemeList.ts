import {themePreference} from "../theme/ThemePreference";
import {Theme} from "@mui/material"
import {createTheme} from "@mui/material";
import {createGlobalStyle} from 'styled-components';

const DarkTheme :Theme = createTheme({
    palette:{
        mode: 'dark',
        primary: {
            main : "#1976d2",
        },
        secondary: {
            main: "#183c63",
        },
    }
},)

const LightTheme :Theme = createTheme({
    palette:{
        mode: 'light',
        primary: {
            main : "#1976d2",
        },
        secondary: {
            main: "#183c63",
        },
        text:{
            primary : "#183c63"
        }
    }
},{Body:"#E7EAEE"})

type themeList = {[key in themePreference]: Theme}

export const ThemeList : themeList = {
    light:LightTheme,
    dark:DarkTheme
}

type Props = {
    theme: Theme
}

export const GlobalStyles = createGlobalStyle<Props>`
    body {
        --background-color-dark : #191919;
        --background-color-light: #E7EAEE;
        background-color: ${props => props.theme.palette.mode === 'dark' ? "var(--background-color-dark)" : "var(--background-color-light)"}
    }
`