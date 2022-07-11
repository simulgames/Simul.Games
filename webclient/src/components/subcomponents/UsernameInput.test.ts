import { describe, it } from "vitest"
import {
    cleanup,
    render,
    getByLabelText,
    fireEvent,
} from "@testing-library/svelte"

import UsernameInput from "./UsernameInput.svelte"

function getFreshUserNameInput(): HTMLInputElement {
    cleanup()
    const { container } = render(UsernameInput)
    return getByLabelText(container, "Your Name") as HTMLInputElement
}

describe("Username Input", () => {
    it("Renders", () => {
        const usernameInput = getFreshUserNameInput()
        expect(usernameInput).toBeDefined()
    })
    it("Has a Max Length of 10", async () => {
        const usernameInput = getFreshUserNameInput()
        await fireEvent.input(usernameInput, {
            target: {
                value: "A large username input will be capped at a max length of ten",
            },
        })
        expect(usernameInput.value.length).toBe(10)
    })
})
