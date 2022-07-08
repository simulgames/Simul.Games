import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true, // required or setupTests will say expect is undefined -- however, discouraged
        setupFiles: "src/setupTests.ts",
    },
})
