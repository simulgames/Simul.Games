# [Simul.Games](https://simul.games)
___
[![codecov](https://codecov.io/gh/simulgames/Simul.Games/branch/main/graph/badge.svg?token=2PZI6ULFEG)](https://codecov.io/gh/simulgames/Simul.Games)

Simul Games is a free online party game server focused on varied, online, realtime, gameplay and ease of use across all devices.

Simul.Games' server is written in Go and using goroutines for a concurrent scalable program. It makes use of WebSockets 
for reliable, quick, communication between clients. In development is a hybrid Rest API / Websocket approach. 

The Web Client is styled with [Tailwind CSS](https://tailwindcss.com/)  and written in [TypeScript](https://www.typescriptlang.org/) using the
[Svelte](https://svelte.dev/) Framework. Both front and back end can be easily proxied by Caddy or Nginx webservers (when deployed using Sveltekit's static site adapter.)

## Development

By default, will open ports 3000 & 8080 on localhost; you can change this in config.yaml.
[Svelte Webkit](https://kit.svelte.dev/), which uses [Vite](https://github.com/vitejs/vite), supports hot-reloading in development, so it will rarely need to be relaunched, but Go will need to be recompiled
for changes to be shown.

### Setup

Requires [Go](https://go.dev/) 1.18+ & [Node](https://nodejs.org/) 16.9+

If you are using Windows (this step is not required on Linux or Mac), you will additionally need to instruct npm to use a terminal emulator that can run *NIX shell scripts. 
For example, with [Git Bash](https://git-scm.com/download/win), 
```shell 
npm config set script-shell 'C:\Program Files\Git\bin\bash.exe'
```

### Commands 

**Start Webclient**
```shell
cd webclient && npm run dev
```
**Run Webclient Tests**
```shell
cd webclient && npm test
```
**Start Server**
```shell
cd server && go run main.go
```
**Run Server Tests**
```shell
cd server && go test ./... -coverpkg=./... -timeout 100ms -race
```

## License
Simul.Games is licensed under the GNU Affero General Public License 3.

## Credits
- All the software mentioned above
- [Gorilla WebSockets](https://github.com/gorilla/websocket) for the server's websockets; [Websocket-ts](https://github.com/jjxxs/websocket-ts) for the webclient's websockets
- [Viper](https://github.com/spf13/viper) for application config management
- [Testify](https://github.com/stretchr/testify), & [Httpexpect](https://github.com/gavv/httpexpect) for server testing, and [Vitest]() for testing the webclient.
- [Cloudflare Pages](https://pages.cloudflare.com/), for deploying Simul.Games
- and others, this list is non-exhaustive