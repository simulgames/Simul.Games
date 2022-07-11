<script lang="ts">
    import { type LobbyData } from "../types/LobbyData"
    import { onMount } from "svelte"
    import { SendMessage } from "../scripts/WebSocket"
    import Keyboard from "./subcomponents/Keyboard.svelte"
    import GameBoard from "./subcomponents/GameBoard.svelte"
    import Paper from "./style/Paper.svelte"
    import ToastContainer from "./subcomponents/ToastContainer.svelte"
    import { toasts } from "../scripts/Toast"
    import NextGameFooter from "./subcomponents/NextGameFooter.svelte"
    import "./style/word-duel.css"

    export let lobbyData: LobbyData = null
    export type GameInfo = {
        Guesses: { id: [number[string]] }
        Results: { id: [number[number]] }
        Successful: boolean
        HasClientFinished: boolean
        HasFinished: boolean
        Word: string
    }

    let gameInfo: GameInfo = null

    function setGameInfo(e: Event) {
        gameInfo = (e as CustomEvent).detail
        if (gameInfo.HasClientFinished) {
            toasts.addToast(`The word was ${gameInfo.Word}`)
        }
        console.log(gameInfo)
    }

    $: KeyBoardClasses = () => {
        let keyboardResults: { letter: number } = {}
        let guesses: [string] = gameInfo
            ? gameInfo.Guesses[lobbyData["client-id"]]
            : []
        let results: [[number]] = gameInfo
            ? gameInfo.Results[lobbyData["client-id"]]
            : [[]]
        for (let turn = 0; turn < results.length; turn++) {
            let guess: string = guesses[turn]
            let result: [number] = results[turn]
            for (let i = 0; i < result.length; i++) {
                let letter: string = guess[i]
                if (
                    keyboardResults[letter] &&
                    result[i] < keyboardResults[letter]
                ) {
                    continue
                }
                keyboardResults[letter] = result[i]
            }
        }
        let keyboardClasses: { id: string } = {}
        for (let key in keyboardResults) {
            keyboardClasses[key] = getStyle(
                "key-with-result",
                keyboardResults[key]
            )
        }
        return keyboardClasses
    }

    let maxLength = 5
    let currentGuess = ""
    $: guessIsRightLength = currentGuess.length == maxLength
    let awaitingReply = false

    function keyUp(e) {
        if (awaitingReply || gameInfo["HasClientFinished"]) {
            return
        }
        let key = (e as KeyboardEvent).key
        if (key == "Backspace") {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1)
            return
        }

        if (key == "Enter") {
            if (guessIsRightLength) {
                SendMessage("SubmitWord", { guess: currentGuess })
                awaitingReply = true
            } else {
                toasts.addToast("Not enough letters")
            }
            return
        }

        if (guessIsRightLength) {
            return
        }

        if (isCharacterALatinLetter(key.toUpperCase())) {
            currentGuess = currentGuess + key.toUpperCase()
        }
    }

    const styles = {
        0: "no-letter",
        1: "has-letter",
        2: "has-letter-at-space",
    }

    const getStyle = (base: string, result: number) => {
        if (result != null) {
            return base + " " + styles[result]
        }
        return ""
    }

    function isCharacterALatinLetter(char: string) {
        if (char.length > 1) {
            return false
        }
        return /[A-Z]/.test(char)
    }

    const animationTimePerResult = 500

    function parseResults(result: string): [string] {
        return result.slice(1, -1).split(" ")
    }

    function CompareResult(id: string, result: string, turn: number) {
        let parsedResult: [string] = parseResults(result)
        let currentResults: [[number]] = gameInfo.Results[id]
            ? gameInfo.Results[id]
            : [[]]
        let updatedResults: [[number]] = [...currentResults]
        updatedResults.push([])
        gameInfo.Results[id] = updatedResults
        for (let i = 0; i < parsedResult.length; i++) {
            setTimeout(() => {
                let updatedResults: [[number]] = [...gameInfo.Results[id]]
                updatedResults[turn].push(Number(parsedResult[i]))
                gameInfo.Results[id] = [...updatedResults]
            }, i * 500)
        }
    }

    function ResultAnimationLength(result: string): number {
        let parsedResult: [string] = parseResults(result)
        return (
            parsedResult.length * animationTimePerResult +
            animationTimePerResult
        )
    }

    function UpdateGuess(id: string, guess: string, turn: number) {
        let currentGuesses: [string] = gameInfo.Guesses[id]
            ? gameInfo.Guesses[id]
            : []
        let updatedGuesses: [string] = [...currentGuesses]
        if (updatedGuesses.length != turn) {
            return
        }
        updatedGuesses.push(guess)
        gameInfo.Guesses[id] = updatedGuesses
    }

    function CompareResultClient(e: Event) {
        let msg = (e as CustomEvent).detail
        awaitingReply = false
        if (msg["status"] == "error") {
            toasts.addToast(
                `${
                    currentGuess[0] + currentGuess.toLowerCase().substring(1)
                } is not in our word list!`
            )
            return
        }

        let turn: number = msg["turn"]
        let clientID = lobbyData["client-id"]
        UpdateGuess(clientID, msg["guess"], turn)
        CompareResult(clientID, msg["result"], turn)

        if (msg["status"] == "finished") {
            setTimeout(() => {
                SendMessage("GameInfo")
                SendMessage("IsGameFinished")
            }, ResultAnimationLength(msg["result"]))
        }

        currentGuess = ""
    }

    function CompareResultOther(e: Event) {
        let msg = (e as CustomEvent).detail
        let id = msg["id"]
        let turn = msg["turn"]
        CompareResult(id, msg["result"], turn)

        let guess = msg["guess"]
        if (guess != undefined) {
            UpdateGuess(id, msg["guess"], turn)
        }

        let status = msg["status"]
        if (gameInfo.HasClientFinished && status == "finished") {
            SendMessage("IsGameFinished")
        }
    }

    function UpdateIsGameFinished(e: Event) {
        let msg = (e as CustomEvent).detail
        gameInfo.HasFinished = msg["finished"] === true
    }

    function gameStarting() {
        toasts.addToast("A new game has started!", 4000)
        SendMessage("GameInfo")
    }

    onMount(() => {
        SendMessage("GameInfo")
        document.addEventListener("GameInfo", setGameInfo)
        document.addEventListener("CompareResultClient", CompareResultClient)
        document.addEventListener("CompareResultOther", CompareResultOther)
        document.addEventListener("IsGameFinished", UpdateIsGameFinished)
        document.addEventListener("keydown", keyUp)
        document.addEventListener("GameStarting", gameStarting)
        return () => {
            document.removeEventListener("GameInfo", setGameInfo)
            document.removeEventListener(
                "CompareResultClient",
                CompareResultClient
            )
            document.removeEventListener(
                "CompareResultOther",
                CompareResultOther
            )
            document.removeEventListener("IsGameFinished", UpdateIsGameFinished)
            document.removeEventListener("keydown", keyUp)
            document.removeEventListener("GameStarting", gameStarting)
        }
    })

    let width = 5
    let height = 6

    $: getLetter = (turn: number, character: number, id: string) => {
        let guesses = gameInfo.Guesses[id]
        if (guesses == null) {
            return ""
        }
        let currentTurn = guesses.length
        if (
            id == lobbyData["client-id"] &&
            turn != height &&
            turn == currentTurn
        ) {
            if (character < currentGuess.length) {
                return currentGuess[character]
            }
            return ""
        }
        if (guesses[turn] != null) {
            return guesses[turn][character]
        }
        return ""
    }

    $: tileBoard = (
        id: string
    ): [
        {
            row: [{ letter: string; style: string }]
            rowStyle: { class: string; delay: number }
        }
    ] => {
        if (id == null) {
            return [
                {
                    row: [{ letter: "err", style: "err" }],
                    rowStyle: { class: "err", delay: 0 },
                },
            ]
        }
        let results = gameInfo.Results[id] ? gameInfo.Results[id] : []
        let tileBoard: [
            {
                row: [{ letter: string; style: string }]
                rowStyle: { class: string; delay: number }
            }
        ] = []
        for (let turn = 0; turn < height; turn++) {
            let row = []
            let rowStyle: { class: string; delay: number } = null
            for (let i = 0; i < width; i++) {
                let letter = getLetter(turn, i, id)
                let result = results[turn] ? results[turn][i] : null
                let style = getStyle("tile-with-result", result)
                let tile = { letter, style }
                row.push(tile)
            }
            if (
                id == lobbyData["client-id"] &&
                gameInfo.Successful &&
                turn + 1 == results.length
            ) {
                rowStyle = {}
                rowStyle.class = "celebrate"
                rowStyle.delay = 100
            }
            let styledRow: {
                row: [{ letter: string; style: string }]
                rowStyle: { class: string; delay: number }
            } = { row: row, rowStyle: rowStyle }
            tileBoard.push(styledRow)
        }
        return tileBoard
    }
</script>

{#if gameInfo != null && lobbyData.members != null}
    <ul
        class="justify-center-safe mx-auto mb-2.5 flex select-none list-none overflow-x-scroll whitespace-nowrap pb-0.5">
        {#each lobbyData.members as member}
            {#if member.id !== lobbyData["client-id"]}
                <li
                    class="m-1 min-w-[6rem] text-center font-mono text-xs font-bold md:min-w-[7rem]">
                    <Paper Class="p-2">
                        <span
                            class="text-sm font-medium text-primary-500 dark:text-white"
                            >{member.name}</span>
                        <GameBoard
                            TileBoard={tileBoard(member.id)}
                            Class="gap-0.5"
                            TileClass="small-tile" />
                    </Paper>
                </li>
            {/if}
        {/each}
    </ul>

    <div
        class="mx-auto flex w-[32vh] max-w-[90vw] font-serif text-2xl font-bold md:text-3xl">
        <GameBoard
            TileBoard={tileBoard(lobbyData["client-id"])}
            Class="flex-grow gap-[1vw] md:gap-[0.5rem]"
            TileClass="bg-white rounded shadow-md dark:bg-zinc-800 dark:text-white" />
    </div>
    <div class="mx-[3vw]">
        <div class="mx-auto max-w-[40rem] justify-center">
            <Keyboard
                isEnterDisabled={!guessIsRightLength}
                KeyBoardClasses={KeyBoardClasses()} />
        </div>
    </div>
    {#if gameInfo.HasFinished}
        <NextGameFooter
            isHost={lobbyData["client-id"] === lobbyData.lobby["host-id"]} />
    {/if}
{/if}

<ToastContainer />

<style>
    .justify-center-safe {
        justify-content: safe center;
    }
</style>
