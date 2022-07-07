package mediator

import (
	"simul-app/server/lobby/factory"
	"simul-app/server/lobby/mediator/replier"
	"simul-app/server/message"
)

type lobbyMediator struct {
	lobbies      map[string]chan message.Message
	msgToLobbies <-chan message.Message
	replier      replyHandler
	toClose      chan string
}

type replyHandler interface {
	HandleReply(msg message.Message)
}

func (m lobbyMediator) run() {
	for {
		select {
		case lobbyID := <-m.toClose:
			if closedLobby, ok := m.lobbies[lobbyID]; ok {
				delete(m.lobbies, lobbyID)
				close(closedLobby)
			}
		case msg, ok := <-m.msgToLobbies:
			if ok {
				m.replier.HandleReply(msg)
			}
		}
	}
}

func New(msgToLobbies <-chan message.Message) {
	lobbyList := make(map[string]chan message.Message)
	closeSignal := make(chan string)
	lobbyFactory := factory.New(lobbyList, closeSignal)
	mediator := lobbyMediator{
		lobbies:      lobbyList,
		msgToLobbies: msgToLobbies,
		replier:      replier.Replier{Lobbies: lobbyList, Factory: lobbyFactory},
		toClose:      make(chan string),
	}
	go mediator.run()
}
