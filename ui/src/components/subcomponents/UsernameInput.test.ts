import {describe,it} from "vitest";
import {cleanup, render, getByLabelText, fireEvent, getByTitle} from "@testing-library/svelte"

import UsernameInput from "./UsernameInput.svelte"

function getFreshUserNameInput() : HTMLInputElement{
    cleanup()
    const {container} = render(UsernameInput)
    return  getByLabelText(container,"Your Name") as HTMLInputElement
}

describe("Username Input",()=>{
    it("Renders",()=>{
        let usernameInput = getFreshUserNameInput()
        expect(usernameInput).toBeDefined()
    })
    it("Has a Max Length of 10",async ()=>{
        let usernameInput = getFreshUserNameInput()
        await fireEvent.input(usernameInput, { target: { value: "abcdefghijklmnopqrstuvwxyz" } });
        expect(usernameInput.value.length).toBe(10)
    })
})