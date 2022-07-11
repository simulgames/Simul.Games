import { describe, it, vi } from "vitest"
import {
    cleanup,
    render,
    getByLabelText,
    fireEvent,
    getByTitle,
} from "@testing-library/svelte"

import "../../scripts/WebSocket"

import LobbyCodeInput from "./LobbyCodeInput.svelte"
import { MockMessageReceivedFromServer } from "../../setupTests"
import * as WebSocket from "../../scripts/WebSocket"
const SendMessageSpy = vi.spyOn(WebSocket, "SendMessage")

function getFreshContainer(): HTMLElement {
    cleanup()
    vi.restoreAllMocks()
    const { container } = render(LobbyCodeInput, {
        ValidLobbyCode: "",
    })
    return container
}

function getLobbyCodeInputElement(): HTMLInputElement {
    const container = getFreshContainer()
    return getByLabelText(container, "Lobby Code") as HTMLInputElement
}

function getLobbyCodeHelperText(): HTMLElement {
    const container = getFreshContainer()
    return getByTitle(container, "helper text")
}

describe("Lobby Code Input", () => {
    describe("Lobby Code Input Behaviour", () => {
        it("Renders", () => {
            const lobbyCodeInput = getLobbyCodeInputElement()
            expect(lobbyCodeInput).toBeDefined()
        })
        it("Has a placeholder value of LOBBY CODE", () => {
            const lobbyCodeInput = getLobbyCodeInputElement()
            expect(lobbyCodeInput.placeholder).toBe("LOBBY CODE")
        })

        it("Is empty without user input", () => {
            const lobbyCodeInput = getLobbyCodeInputElement()
            expect(lobbyCodeInput).toHaveTextContent("")
        })

        it("Does not accept non numeric inputs", async () => {
            const lobbyCodeInput = getLobbyCodeInputElement()
            await fireEvent.input(lobbyCodeInput, {
                target: { value: "h3ll0 w0r1d" },
            })
            expect(lobbyCodeInput.value).toBe("3001")
        })

        it("Has a maximum input of 6 digits", async () => {
            const lobbyCodeInput = getLobbyCodeInputElement()
            await fireEvent.input(lobbyCodeInput, {
                target: { value: "1234567890" },
            })
            expect(lobbyCodeInput.value.length).toBe(6)
        })

        it("Will send a message upon receiving a valid 6 digit code", async () => {
            const lobbyCodeInput = getLobbyCodeInputElement()
            const dummyCode = "123456"
            await fireEvent.input(lobbyCodeInput, {
                target: { value: dummyCode },
            })
            expect(SendMessageSpy).toHaveBeenCalledWith(
                "GetLobbyDataExternal",
                { code: dummyCode }
            )
        })
    })

    describe("Lobby Status Helper Text", () => {
        it("Exists", () => {
            const helperText = getLobbyCodeHelperText()
            expect(helperText).toBeDefined()
        })
        it("Contains nothing to begin with", () => {
            const helperText = getLobbyCodeHelperText()
            expect(helperText).toHaveTextContent("")
        })
        it("Gives Error when Invalid Lobby", async () => {
            const container = getFreshContainer()
            await MockMessageReceivedFromServer("LobbyNotFound")
            const helperText = getByTitle(container, "helper text")
            expect(helperText).toHaveTextContent("Lobby Not Found!")
        })

        it("Displays status when Valid Lobby", async () => {
            const container = getFreshContainer()
            const lobbyCode = "123456"
            const lobbyCodeInput = getByLabelText(
                container,
                "Lobby Code"
            ) as HTMLInputElement
            await fireEvent.input(lobbyCodeInput, {
                target: { value: lobbyCode },
            })
            const status = "hello, world!"
            await MockMessageReceivedFromServer("LobbyFound", {
                lobby: lobbyCode,
                status: status,
            })
            const helperText = getByTitle(container, "helper text")
            expect(helperText).toHaveTextContent(status)
        })
    })
})
