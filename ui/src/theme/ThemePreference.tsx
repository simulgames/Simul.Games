import {useState} from "react";

const itemName = "override_theme_preference"

export enum themePreference{
    light = "light",
    dark = "dark"
}

const defaultTheme = themePreference.light


function browserPrefersDarkMode(): boolean{
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function browserPreference(): themePreference{
    if(browserPrefersDarkMode()){
        return themePreference.dark
    } else {
        return defaultTheme
    }
}

function redundantPreference(preference:themePreference): boolean{
    return browserPreference() === preference
}

function removePreference(){
    window.localStorage.removeItem(itemName)
}

function storeThemePreference(preference:themePreference){
    if(redundantPreference(preference)){
        removePreference()
    } else {
        window.localStorage.setItem(itemName,preference)
    }
}

function GetThemePreference() : themePreference{
    let themeOverride = window.localStorage.getItem(itemName) as themePreference | null
    if(themeOverride == null){
        return browserPreference()
    }
    if(redundantPreference(themeOverride)) {
        removePreference()
    }
    return themeOverride
}

export function useThemeHook() : [themePreference,(theme:themePreference)=>void]{
    const [storedTheme,setStoredTheme] = useState(() => {
        if(typeof window === "undefined"){
            return browserPreference()
        }
        try {
            return GetThemePreference()
        }
        catch (error){
            console.log(error)
            return browserPreference()
        }
    })
    
    const setThemePreference = (theme:themePreference) =>{
        try{
            setStoredTheme(theme)
            storeThemePreference(theme)
        }
        catch (error){
            console.log(error)
        }
    }
    return [storedTheme,setThemePreference]
}