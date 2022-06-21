import * as React from "react";
import Button, {ButtonProps} from "@mui/material/Button";
import BackspaceRoundedIcon from "@mui/icons-material/BackspaceRounded";
import KeyboardReturnRoundedIcon from "@mui/icons-material/KeyboardReturnRounded";
import { styled } from '@mui/material/styles';

type Props = {
    style:{[id:string]:React.CSSProperties}
    enableEnter:boolean
    keyPressed:(e: HTMLButtonElement) => void
    enterPressed:() => void
}

const KeyboardButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color : theme.palette.text.primary,
    backgroundColor : theme.palette.mode === "light" ? "white" : "#222222"
}))

export const Keyboard = (props:Props) => {

    function getLetterKeyboard(letter:string,style:React.CSSProperties){
        return <KeyboardButton key ={letter} sx={style} variant="outlined" data-key={letter} onClick={(e) => props.keyPressed(e.currentTarget)}>{letter}</KeyboardButton>
    }

    function getLettersKeyboard(letters:string[],letterStyles:{[id:string]:React.CSSProperties}){
        let keys = []
        for(let i in letters){
            let letter = letters[i]
            let letterStyle = letterStyles[letter.toUpperCase()]
            keys.push(getLetterKeyboard(letter,letterStyle))
        }
        return keys
    }

    return <div className="game-keyboard">
            <div className="row">
                {getLettersKeyboard(["Q","W","E","R","T","Y","U","I","O","P"],props.style)}
            </div>
            <div className="row">
                {getLettersKeyboard(["A","S","D","F","G","H","J","K","L"], props.style)}
                <KeyboardButton variant="outlined" data-key="Backspace" onClick={(e) => props.keyPressed(e.currentTarget)}><BackspaceRoundedIcon/></KeyboardButton>
            </div>
            <div className="row">
                <div className="three-quarter-button"/>
                {getLettersKeyboard(["Z","X","C","V","B","N","M"], props.style)}
                <Button variant="contained" data-key="Enter" className="enter-button" disabled={!props.enableEnter} onClick={() => props.enterPressed()}><KeyboardReturnRoundedIcon/></Button>
                <div className="three-quarter-button"/>
            </div>
        </div>
}