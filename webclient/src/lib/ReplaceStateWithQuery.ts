// credit : https://dev.to/mohamadharith/mutating-query-params-in-sveltekit-without-page-reloads-or-navigations-2i2b

export const replaceStateWithQuery = (values: Record<string, string>) => {
    const url = new URL(window.location.toString())
    for (const [k, v] of Object.entries(values)) {
        if (v) {
            url.searchParams.set(encodeURIComponent(k), encodeURIComponent(v))
        } else {
            url.searchParams.delete(k)
        }
    }
    history.replaceState({}, "", url)
}
