import "@testing-library/jest-dom/extend-expect"
import { act } from "@testing-library/svelte"

export async function MockMessageReceivedFromServer(
    header: string,
    body?: Record<string, unknown>
) {
    const invalidLobbyEvent = new CustomEvent(header, {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: body,
    })
    await act(() => {
        document.dispatchEvent(invalidLobbyEvent)
    })
}
