import { describe, it } from "vitest"
import {
    cleanup,
    render,
    getByLabelText,
    fireEvent,
    getByTitle,
} from "@testing-library/svelte"
import type { SendMessage } from "src/scripts/WebSocket"

import LobbyCodeInput from "./LobbyCodeInput.svelte"
import { MockSendMessage } from "../../setupTests"

let lastMessageSent: any
const sendMessage: SendMessage = (header, body) => {
    lastMessageSent = { Header: header, Body: body }
}

function getFreshContainer(): HTMLElement {
    cleanup()
    lastMessageSent = undefined
    const { container } = render(LobbyCodeInput, {
        ValidLobbyCode: "",
        sendMessage: sendMessage,
    })
    return container
}

function getLobbyCodeInputElement(): HTMLInputElement {
    let container = getFreshContainer()
    return getByLabelText(container, "Lobby Code") as HTMLInputElement
}

function getLobbyCodeHelperText(): HTMLElement {
    let container = getFreshContainer()
    return getByTitle(container, "helper text")
}

describe("Lobby Code Input", () => {
    describe("Lobby Code Input Behaviour", () => {
        it("Renders", () => {
            let lobbyCodeInput = getLobbyCodeInputElement()
            expect(lobbyCodeInput).toBeDefined()
        })
        it("Has a placeholder value of LOBBY CODE", () => {
            let lobbyCodeInput = getLobbyCodeInputElement()
            expect(lobbyCodeInput.placeholder).toBe("LOBBY CODE")
        })

        it("Is empty without user input", () => {
            let lobbyCodeInput = getLobbyCodeInputElement()
            expect(lobbyCodeInput).toHaveTextContent("")
            expect(lastMessageSent).not.toBeDefined()
        })

        it("Does not accept non numeric inputs", async () => {
            let lobbyCodeInput = getLobbyCodeInputElement()
            await fireEvent.input(lobbyCodeInput, {
                target: { value: "h3ll0 w0r1d" },
            })
            expect(lobbyCodeInput.value).toBe("3001")
        })

        it("Has a maximum input of 6 digits", async () => {
            let lobbyCodeInput = getLobbyCodeInputElement()
            await fireEvent.input(lobbyCodeInput, {
                target: { value: "1234567890" },
            })
            expect(lobbyCodeInput.value.length).toBe(6)
        })

        it("Will send a message upon receiving a valid 6 digit code", async () => {
            let lobbyCodeInput = getLobbyCodeInputElement()
            await fireEvent.input(lobbyCodeInput, {
                target: { value: "123456" },
            })
            expect(lastMessageSent.Body["code"]).toBe("123456")
        })
    })

    describe("Lobby Status Helper Text", () => {
        it("Exists", () => {
            let helperText = getLobbyCodeHelperText()
            expect(helperText).toBeDefined()
        })
        it("Contains nothing to begin with", () => {
            let helperText = getLobbyCodeHelperText()
            expect(helperText).toHaveTextContent("")
        })
        it("Gives Error when Invalid Lobby", async () => {
            let container = getFreshContainer()
            await MockSendMessage("LobbyNotFound")
            let helperText = getByTitle(container, "helper text")
            expect(helperText).toHaveTextContent("Lobby Not Found!")
        })

        it("Displays status when Valid Lobby", async () => {
            let container = getFreshContainer()
            let lobbyCode = "123456"
            let lobbyCodeInput = getByLabelText(
                container,
                "Lobby Code"
            ) as HTMLInputElement
            await fireEvent.input(lobbyCodeInput, {
                target: { value: lobbyCode },
            })
            let status = "hello, world!"
            await MockSendMessage("LobbyFound", {
                lobby: lobbyCode,
                status: status,
            })
            let helperText = getByTitle(container, "helper text")
            expect(helperText).toHaveTextContent(status)
        })
    })
})
