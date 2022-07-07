package main

import (
	"log"
	"math/rand"
	"net/http"
	"simul-app/config"
	"simul-app/games"
	lobbyMediator "simul-app/server/lobby/mediator"
	"simul-app/server/message"
	"simul-app/server/user/connection/websocket"
	"simul-app/server/user/factory"
	"simul-app/server/user/factory/builder"
	"time"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	games.Setup()
	msgToLobbies := make(chan message.Message)
	lobbyMediator.New(msgToLobbies)
	concreteBuilder := builder.New(msgToLobbies)
	serverConfig := config.New()
	handler := websocket.New(serverConfig.GetOrigin())
	concreteFactory := factory.New(handler, concreteBuilder)
	port := serverConfig.GetPort()
	log.Println(http.ListenAndServe(port, concreteFactory))
}
