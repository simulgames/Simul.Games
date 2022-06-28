import { beforeEach, test, expect } from "vitest"
import { cleanup, render } from "@testing-library/svelte"

import LobbyCodeInput from "./LobbyCodeInput.svelte"

beforeEach(cleanup)

test("Can Render", () => {
    render(LobbyCodeInput)
})

test("labeled as Lobby Code", () => {
    const { getByText } = render(LobbyCodeInput)
    expect(getByText("Lobby Code")).toBeDefined()
})