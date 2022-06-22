import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import "./WordDuel.scss"
import "./game.scss"
import {Backdrop, Card, SpeedDial, SpeedDialAction, SpeedDialIcon} from "@mui/material";
import {Member} from "../Member";
import {Keyboard} from "./keyboard";
import Paper from "@mui/material/Paper";
import {animated, config, useTransition} from 'react-spring'
import NextPlanRoundedIcon from '@mui/icons-material/NextPlanRounded';
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import {ConnectionState, SendMessage} from "../../../props/WebSockets";


enum guessCommand {backSpace,nextTurn}

type turnAnimation = {turn:number,
    animationClass:string,
    textAnimation:string
    delay:number
    toggle:boolean
}

type memberGuesses = {
    wordLength:number,
    maxGuesses:number
    clientID:string,
    guesses:{[id:string]:string[]}
    clientWord:string|null
    turnAnimation:turnAnimation|null
}

type guessUpdate = {letter?:string,command?:guessCommand}
type otherPlayerUpdate = {id:string, word:string}

type memberGuessUpdate = {
    wordLength?:number,
    maxGuesses?:number,
    turnAnimation?: string,
    animationDelay?:number,
    textAnimation?: string,
    set?:{[id:string]:string[]},
    update?:guessUpdate,
    otherUpdate?:otherPlayerUpdate
}

function guessReducer(oldGuess: memberGuesses,update:memberGuessUpdate){

    if(update.otherUpdate != null){
        let otherGuesses = (update.otherUpdate.id in oldGuess.guesses) ? [...oldGuess.guesses[update.otherUpdate.id]] : []
        otherGuesses.push(update.otherUpdate.word)
        let newGuesses = {...oldGuess.guesses}
        newGuesses[update.otherUpdate.id] = otherGuesses
        return {...oldGuess,
            guesses: newGuesses
        }
    }

    if(update.wordLength != null){
        return {...oldGuess,
            wordLength:update.wordLength
        }
    }

    if(update.maxGuesses != null){
        return {...oldGuess,
            maxGuesses:update.maxGuesses
        }
    }


    if(update.set != null){
        return {
            ...oldGuess,
            guesses: update.set
        }
    }

    let clientGuesses = [...oldGuess.guesses[oldGuess.clientID]]

    if(update.turnAnimation != null){
        let currentTurn = clientGuesses.length -1
        let delay = update.animationDelay ? update.animationDelay : 0
        let textClass = update.textAnimation ? update.textAnimation : ""
        return {...oldGuess,
            turnAnimation:{turn:currentTurn,
                animationClass:update.turnAnimation,
                textAnimation:textClass,
                delay:delay,
                toggle: oldGuess.turnAnimation ? !oldGuess.turnAnimation.toggle : false
        }
        }
    }


    if(update.update != null && clientGuesses.length <= oldGuess.maxGuesses){
        let newGuesses = {...oldGuess.guesses}
        if(update.update.command === guessCommand.nextTurn){
            clientGuesses.push("")
            newGuesses[oldGuess.clientID] = clientGuesses
            return {
                ...oldGuess,
                clientWord:null,
                turnAnimation:null,
                guesses: newGuesses
            }
        }

        let clientGuess : string = clientGuesses[clientGuesses.length-1]

        if(update.update.command === guessCommand.backSpace){
            clientGuess = clientGuess.slice(0,-1)
        }

        if (update.update.letter !== undefined){
            if(clientGuess.length !== oldGuess.wordLength){
                clientGuess += update.update.letter
            }
        }

        clientGuesses[clientGuesses.length-1] = clientGuess
        newGuesses[oldGuess.clientID] = clientGuesses

        return {...oldGuess,
            clientWord: clientGuess.length === oldGuess.wordLength ? clientGuess : null,
            guesses:newGuesses,
            turnAnimation:null,
        }
    }
    return oldGuess
}

enum letterFound {NoLetter,HasLetter,HasSameLetter}


const noLetter : React.CSSProperties = {color:"white !important",backgroundColor:"#787c7e !important"}
const hasLetter : React.CSSProperties = {color:"white !important",backgroundColor:"#c9b458 !important"}
const hasLetterAtSpace : React.CSSProperties = {color:"white !important",backgroundColor:"#6aaa64 !important"}

const letterFoundToStyle = [noLetter,hasLetter,hasLetterAtSpace]

const letterFoundToClassName = ["no-letter","has-letter","has-letter-at-space"]

type resultUpdate = {update?:guessResultUpdate,set?:{[id:string]:number[][]}}

type guessResultUpdate = {id:string,turn:number,letter:number,result:letterFound}

type guessResult = {[id:string]:string[][]}


function resultReducer(results: guessResult, result:resultUpdate){

    if(result.set != null){
        let setResult : guessResult = {}
        for(let id in result.set){
            setResult[id] = []
            for(let turn = 0;turn < result.set[id].length;turn++){
                setResult[id][turn] = []
                for(let letter=0;letter<result.set[id][turn].length;letter++){
                    setResult[id][turn][letter] = letterFoundToClassName[result.set[id][turn][letter]]
                }
            }
        }
        return setResult
    }

    let update = result.update as guessResultUpdate
    let currentResults = {...results}
    let player = currentResults[update.id]
    if(player == null){
        currentResults[update.id] = []
    }
    let currentTurn = currentResults[update.id][update.turn]
    if(currentTurn == null){
        currentResults[update.id][update.turn] = []
    }
    currentResults[update.id][update.turn][update.letter] = (letterFoundToClassName[update.result])
    return currentResults
}

type keyStyle = {letter:string,found:letterFound}

function letterReducer(letters:{[id:string]:React.CSSProperties},updates: keyStyle[]|null){
    if(updates == null){
        return {}
    }
    let newLetters = {...letters}
    for(let i in updates){
        let update = updates[i]
        let letter = update.letter.toUpperCase()
        let letterExists = newLetters[letter] != null

        if(letterExists){
            if(+update.found !== letterFound.HasSameLetter){ // we only care to update if the information is more important
                continue
            }
        }
        newLetters[letter] = letterFoundToStyle[+update.found]
    }
    return newLetters
}

type Props = {send:SendMessage
    members : {[id:string]:Member}
    clientID : string
    hostID : string
    state:ConnectionState
};


export const WordDuel = (props:Props) => {

    const [popDown,setPopDown] = React.useState("")

    const sendMsg = props.send

    const [guesses,updateGuess] = React.useReducer(guessReducer, {
        clientID:props.clientID,
        wordLength:5, // max 10, realistically, 16 programmatically
        guesses:{},
        maxGuesses:6, // max 9, realistically, 16 programmatically
        clientWord:null,
        turnAnimation:null})
    const [awaitingReply,setAwaitingReply] = React.useState(true)
    const [guessResults,updateGuessResults] = React.useReducer(resultReducer,{})
    const [keyStyles,updateKeyStyles] = React.useReducer(letterReducer,{});
    const [gameFinished,setGameFinished] = React.useState(false);
    const [clientFinished,setClientFinished] = React.useState(false);
    const [invalidWord,setInvalidWord] = React.useState(false)

    const [invalidWordAnimation,setInvalidWordAnimation] = React.useState(false)

    useEffect(()=>{
        if(guesses.clientWord == null){
            setInvalidWord(false)
        }
    },[guesses.clientWord])

    useEffect(()=>{
        if(!invalidWord){
            setPopDown("")
        }
    },[invalidWord])

    function AnimateInvalidWord(){
        updateGuess({turnAnimation:"error-shake",textAnimation:"error-shake"})
        setPopDown("Word not in Word List!")
    }

    useEffect(()=>{
        if(invalidWordAnimation){
            AnimateInvalidWord()
        }
    },[invalidWordAnimation])

    const sendWord = useCallback(() => {
        if(awaitingReply){
            return;
        }
        if(invalidWord){
            if(invalidWordAnimation){
                return;
            }
            updateGuess({turnAnimation:""})
            setInvalidWordAnimation(true)
            setTimeout(()=>{
                setInvalidWordAnimation(false)
            },2500)
            return
        }
        if(guesses.clientWord != null){
            updateGuess({turnAnimation:""})
            sendMsg({Header:"SubmitWord",Body:{guess:guesses.clientWord}})
            setAwaitingReply(true)
        }
    },[awaitingReply, guesses.clientWord, invalidWord, invalidWordAnimation, sendMsg])

    const compareClientWord = useCallback( (e:Event) => {
        let msg = (e as CustomEvent).detail
        let status = msg["status"]
        if(status === "error"){
            setAwaitingReply(false)
            setInvalidWord(true)
            AnimateInvalidWord()
            return
        }
        let result = msg["result"].slice(1,-1).split(" ")
        let guess = msg["guess"]
        let turn = msg["turn"]
        let keyStylesUpdate : keyStyle[] = []
        for(let i = 0;i<guess.length;i++){
            let letter = guess.charAt(i)
            setTimeout( () =>{
                updateGuessResults({update:{
                    id:props.clientID,
                    turn:turn,
                    letter:i,
                    result:result[i]
                }})
            },i*500)
            keyStylesUpdate.push({
                letter:letter,
                found:result[i],
            })
        }
        let isComplete = status === "finished"
        setTimeout( () =>{
            if(isComplete){
                sendMsg({Header:"GameInfo"})
            }
            updateKeyStyles(keyStylesUpdate)
        },guess.length*500)
        if(!isComplete){
            updateGuess({update:{command:guessCommand.nextTurn}})
            setAwaitingReply(false)
        }
    },[props.clientID, sendMsg])


    const queryGameFinished = useCallback(()=>{
        sendMsg({Header:"IsGameFinished"})
    },[sendMsg])

    const compareResultOther = useCallback( (e:Event) => {
        let msg = (e as CustomEvent).detail
        let result = msg["result"].slice(1,-1).split(" ")
        let guess = msg["guess"]
        let turn = msg["turn"]
        let id = msg["id"]
        if(msg["status"] === "finished"){
            queryGameFinished()
        }
        if(guess != null){
            updateGuess({otherUpdate:{id:id,word:guess}})
        }
        for(let i = 0;i<result.length;i++){
            setTimeout( () =>{
                updateGuessResults({update:{
                    id:id,
                    turn:turn,
                    letter:i,
                    result:result[i]
                }})
            },i*500)
    }},[queryGameFinished])


    const handleSubmit = useCallback( (e:KeyboardEvent) => {
        if(e.key === "Enter"){
            sendWord()
        }
    },[sendWord])

    const updateGuessFromKey = useCallback( (key:string) => {
        if(clientFinished || awaitingReply){
            return;
        }
        if(key === "Backspace"){
            updateGuess({update:{command: guessCommand.backSpace}})
            return
        }
        let letter = key.toUpperCase()
        if(isCharacterALatinLetter(letter)){
            updateGuess({update:{letter}})
            return;
        }
        },[awaitingReply, clientFinished])

    const onScreenKeyboard = useCallback( (e:HTMLButtonElement) => {
        let key = e.getAttribute("data-key")
        if(key != null){
            updateGuessFromKey(key)
        }
    },[updateGuessFromKey])

    function TileIndex(x:number, y:number){
        let aX = x << 4
        return (aX | y)
    }

    const getClassName = useCallback((className:string,id:string,letter:number,turn:number,content:string|null) => {
        let style = null
        let guessResultStyles = guessResults[id]
        if(guessResultStyles != null){
            let turnStyles = guessResultStyles[turn]
            if(turnStyles != null){
                style = turnStyles[letter]
            }
        }
        if(style != null){
            className += " tile-with-result " + style
        }
        if(content != null && style == null){
                className += " inputted-letter"
        }
        return className
    },[guessResults])

    const LargeTile = useCallback((letter:number,turn:number)=>{
        let content = null
        let clientGuesses = guesses.guesses[props.clientID]
        if(clientGuesses != null){
            let word = clientGuesses[turn]
            if(word != null){
                content = word[letter]
            }
        }
        let className = getClassName("large-tile",props.clientID,letter,turn,content)
        let parentDivClassName = ""
        let delay = 0
        let spanClass = "tile-text "
        let key = TileIndex(letter,turn)
        if(guesses.turnAnimation && turn === guesses.turnAnimation.turn && content){
            parentDivClassName = guesses.turnAnimation.animationClass
            delay = guesses.turnAnimation.delay
            spanClass += guesses.turnAnimation.textAnimation
        }
        return <div className={parentDivClassName} style={{animationDelay:`${delay*letter}s`}} key={key}>
            <Paper className={className} elevation = {content == null ? 2 : 5}>
                <span className={spanClass}>{content?.toUpperCase()}</span>
            </Paper>
        </div>
    },[getClassName, guesses.guesses, guesses.turnAnimation, props.clientID])

    function SmallTile(x:number,y:number,className:string,content?:string){
        return  <div className={className} key={TileIndex(x,y)}>{content ? <span className="tile-text">{content}</span> : ""}</div>
    }


    const DrawLargeBoard = useCallback(() => {
        let tiles = [];
        for(let y=0;y<guesses.maxGuesses;y++){
            for(let x=0;x<guesses.wordLength;x++){
                tiles.push(LargeTile(x,y))
            }
        }
        return <div className="board" style={{width: `${guesses.wordLength/guesses.maxGuesses * 40}vh`,gridTemplateColumns: `repeat(${guesses.wordLength}, 1fr)`}}>
            {tiles}
        </div>
    },[LargeTile, guesses.maxGuesses, guesses.wordLength])

    function DrawSmallBoard(id:string){
        let tiles = [];
        for(let turn=0;turn<guesses.maxGuesses;turn++){
            for(let letter=0;letter<guesses.wordLength;letter++){
                let className = getClassName("small-tile",id,letter,turn,null)
                let content = undefined
                if(guesses.guesses[id] && guesses.guesses[id][turn]){
                    content = guesses.guesses[id][turn][letter]
                }
                tiles.push(SmallTile(letter,turn,className,content))
            }
        }
        return <div className="board" style={{gridTemplateColumns: `repeat(${guesses.wordLength}, 1fr)`}}>
            {tiles}
        </div>
    }

    function RenderPlayer(name:string,id:string,expand:boolean){
        let className = expand ? "other-player other-player-expanded" : "other-player other-player-minimized"
        return <Card className={className} elevation={2} key = {id}>
            <span className="player-name">{name.toUpperCase()}</span>
            <div className="result">{DrawSmallBoard(id)}</div>
        </Card>
    }

    function RenderPlayers(expand:boolean){
        let players = []
        for(let memberID in props.members){
            let member = props.members[memberID]
            let name = member.name
            if(memberID === props.clientID){
                if(!expand){
                    continue
                }
                name = "YOU"
            }
            let playerCard = RenderPlayer(name,memberID,expand)
            if(memberID !== props.clientID){
                players.push(playerCard)
            } else {
                players.unshift(playerCard)
            }
        }
        return <React.Fragment>
            {players}
        </React.Fragment>
    }

    function isCharacterALatinLetter(char:string) {
        if(char.length > 1){
            return false
        }
        return (/[A-Z]/).test(char)
    }

    const handleKeyDown = useCallback( (e:KeyboardEvent) => {
        updateGuessFromKey(e.key)
    },[updateGuessFromKey])


    const updateKeyStyleFromGuesses = useCallback((guesses: string[],results: number[][]) => {
        let keyStylesUpdate : keyStyle[] = []
        for(let turn in guesses){
            let word = guesses[turn]
            if (word == null || word === ""){
                break
            }
            for(let letter=0; letter < word.length;letter++){
                let result = results[turn][letter]
                keyStylesUpdate.push({
                    letter:word[letter],
                    found:result,
                })
            }
        }
        setTimeout( () =>{
            updateKeyStyles(keyStylesUpdate)
        },400)
    },[])

    const setGameInfo = useCallback( (e:Event) => {
        let msg = (e as CustomEvent).detail
        let guesses = msg["Guesses"]
        let results = msg["Results"]
        updateGuess({set:guesses})
        updateGuessResults({set:results})

        setClientFinished(msg["HasClientFinished"])
        if(msg["HasClientFinished"]){
            if(msg["Successful"]){
                setPopDown("Well done!")
                updateGuess({turnAnimation:"celebrate",animationDelay:0.1})
            } else {
                let word = msg["Word"].charAt(0) + msg["Word"].substring(1).toLowerCase();
                setPopDown(`The word was "${word}"`)
            }
        }

        setGameFinished(msg["HasFinished"])

        updateKeyStyleFromGuesses(guesses[props.clientID],results[props.clientID])
        setAwaitingReply(false)
    },[props.clientID, updateKeyStyleFromGuesses])

    useEffect( () => {
        document.addEventListener("GameInfo",setGameInfo)
        return () => {
            document.addEventListener("GameInfo",setGameInfo)
        }
    },[setGameInfo])

    useEffect(()=>{
        if(props.state === ConnectionState.OPEN){
            sendMsg({Header:"GameInfo"})
        }
    },[props.state, sendMsg])

    useEffect(() =>{
        document.addEventListener("keydown",handleKeyDown)
        return () => {
            document.removeEventListener("keydown",handleKeyDown)
        }
    },[handleKeyDown])

    useEffect(() =>{
        document.addEventListener("keydown",handleSubmit)
        return () => {
            document.removeEventListener("keydown",handleSubmit)
        }
    },[handleSubmit])

    useEffect( () =>{
        document.addEventListener("CompareResultClient",compareClientWord)
        document.addEventListener("CompareResultOther",compareResultOther)
        return () => {
            document.removeEventListener("CompareResultClient",compareClientWord)
            document.removeEventListener("CompareResultOther",compareResultOther)
        }
    },[compareClientWord, compareResultOther])



    const popDownTransition = useTransition( popDown ,{
        config:{...config.gentle},
        delay:100,
        from:{opacity:1,top:"10%",},
        enter:{opacity:1,top:"15%"},
        leave:{opacity:0,top:"20%"},
        onRest:()=>{setPopDown("")}
        })



    const displayPopDown = useCallback(() => {

        return <div>{popDownTransition( (styles,item) => item !== "" && <animated.div className="pop-down" style={styles}><Paper elevation={10}>
            {item}
        </Paper></animated.div>)}</div>
    },[popDownTransition])



    const [playerListExpanded,setExpandPlayerList] = useState(false)


    // new game NextPlanRoundedIcon -> popup 'only the host - all players must be finished'
    // toggle  ZoomInRoundedIcon / ZoomOutRoundedIcon

    const nextGame = useCallback(() =>{
            if(!gameFinished){
                setPopDown("Not all players are finished!")
                return
            }
            if(guesses.clientID !== props.hostID){
                setPopDown("Only the host can do this!")
                return;
            }
            sendMsg({Header:"NewGame"})
        },[gameFinished, guesses.clientID, props.hostID, sendMsg])


    const onNewGame = useCallback(()=>{
        sendMsg({Header:"GameInfo"})
        setPopDown("A new game has started!")
        updateKeyStyles(null)
    },[sendMsg])

    useEffect(()=>{
        document.addEventListener("MemberJoined",queryGameFinished)
        document.addEventListener("MemberLeft",queryGameFinished)
        document.addEventListener("GameStarting",onNewGame)
        return () => {
            document.removeEventListener("GameStarting",onNewGame)
            document.removeEventListener("MemberJoined",queryGameFinished)
            document.removeEventListener("MemberLeft",queryGameFinished)
        }
    },[onNewGame, queryGameFinished])

    const gameFinishedResponse = useCallback((e:Event)=>{
        let msg = (e as CustomEvent).detail
        setGameFinished(msg["finished"])
    },[])

    useEffect(()=>{
        document.addEventListener("IsGameFinished",gameFinishedResponse)
        return () =>{
            document.addEventListener("IsGameFinished",gameFinishedResponse)
        }
    },[gameFinishedResponse])

    const [speedDialOpen, setSpeedDialOpen] = React.useState(false);
    const handleSpeedDialOpen = () => setSpeedDialOpen(true);
    const handleSpeedDialClose = () => setSpeedDialOpen(false);


    function expandPrompt(){
        return <SpeedDial
                           ariaLabel={"finished-game-speed-dial"}
                           sx={{ position: 'absolute', bottom: 16, right: 16}}
                           icon={<SpeedDialIcon/>}
                           onOpen={handleSpeedDialOpen}
                           onClose={handleSpeedDialClose}
                           open={speedDialOpen}
        >
            <SpeedDialAction
                key={playerListExpanded ? "Minimize": "Expand"}
                icon={playerListExpanded ? <ZoomOutRoundedIcon/> : <ZoomInRoundedIcon/>}
                tooltipTitle={playerListExpanded ? "Minimize": "Expand"}
                tooltipOpen={window.matchMedia("(pointer: coarse)").matches}
                onClick={() => {
                    setExpandPlayerList(!playerListExpanded)
                    setSpeedDialOpen(false)
                }}
            />
            <SpeedDialAction
                key={"Next Game"}
                icon={<NextPlanRoundedIcon/>}
                tooltipTitle={"Next Game"}
                tooltipOpen={window.matchMedia("(pointer: coarse)").matches}
                onClick={() => {
                    nextGame()
                    setSpeedDialOpen(false)
                }}
            />
        </SpeedDial>
    }

    function displayPlayerList(expand:boolean){
        return <li className={expand ? "player-list player-list-expanded": "player-list player-list-header"}>
            {RenderPlayers(expand)}
        </li>
    }

    function displayGameBoard(){
        return <React.Fragment>
            {displayPlayerList(false)}
            <div className="game-tab">
                <div className="game-view ">
                    {DrawLargeBoard()}
                </div>
            </div>
            <Keyboard style={keyStyles} enableEnter={guesses.clientWord != null && !clientFinished && !awaitingReply && !invalidWordAnimation} keyPressed={onScreenKeyboard} enterPressed={sendWord}/>
        </React.Fragment>
    }



    return <React.Fragment>
        {playerListExpanded ? displayPlayerList(true) : displayGameBoard()}
        {clientFinished ? expandPrompt() : ""}
        <Backdrop open={speedDialOpen}/>
        {displayPopDown()}
    </React.Fragment>
}