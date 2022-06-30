# [Simul.Games](https://simul.games)

Simul Games is a free online party game server focused on realtime, varied, gameplay and ease of use across all devices.

Simul.Games is written in Go and using goroutines for a concurrent scalable program. 
It makes use of WebSockets for reliable communication between clients. The Web Client is styled in [Tailwind CSS](https://tailwindcss.com/)  and written in [TypeScript](https://www.typescriptlang.org/) using the
[Svelte](https://svelte.dev/) Framework. Both front and back end can be easily proxied by Caddy or Nginx webservers. 

## Development

requires: go & npm. By default, will open ports 3000 & 8080 on localhost; you can change this in config.yaml.
[Svelte Webkit](https://kit.svelte.dev/) supports hot-reloading in development, so it will rarely need to be relaunched, but Go will need to be recompiled
for changes to be shown.

```shell
cd ui && npm run start      # start webclient using port defined in config.yaml
```
```shell
cd ui && npm test           # run webclient tests
```

```shell
cd app && go run main.go    # start backend using port defined in config.yaml
```
```shell
cd app && go test ./... -coverpkg=./... -timeout 100ms -race # run go tests
```

## License
Simul.Games is licensed under the GNU Affero General Public License 3.

## Credits
- [Gorilla WebSockets](https://github.com/gorilla/websocket) for application sockets
- [Viper](https://github.com/spf13/viper) for application config management
- and others, this list is non-exhaustive