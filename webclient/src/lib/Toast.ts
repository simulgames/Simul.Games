import { type Writable, writable } from "svelte/store"
import { v4 } from "uuid"

function createToasts() {
    const { subscribe, set, update }: Writable<{ [id: string]: string }> =
        writable({})
    function removeToast(id: string) {
        update((toast) => {
            const newToast = { ...toast }
            delete newToast[id]
            return newToast
        })
    }

    return {
        subscribe,
        addToast: (text: string, duration = 2000) =>
            update((toast) => {
                const newToast = { ...toast }
                const id = v4()
                newToast[id] = text
                setTimeout(() => {
                    removeToast(id)
                }, duration)
                return newToast
            }),
        reset: () => set({}),
    }
}

export const toasts = createToasts()
