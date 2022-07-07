package factory

import (
	"encoding/json"
	"log"
	"simul-app/server/lobby/strategy"
	"simul-app/server/message"
	"simul-app/server/message/reply"
	"simul-app/server/message/reply/header"
)

type memberList interface {
	IsActive() bool
	NodeInLobby(node message.Node) bool
	Add(node message.Node, memberJSON json.RawMessage)
	Remove(node message.Node)
	Shutdown()
}

type lobby struct {
	members memberList
	Id      string

	receivedMessage chan message.Message
	lobbyClosed     chan<- string

	strategy strategy.Strategy
}

func (l lobby) run() {
	defer l.shutdown()
	requestedShutdown := false
	for {
		if !l.isActive() && !requestedShutdown {
			requestedShutdown = true
			go func() {
				l.lobbyClosed <- l.Id
			}()
		}
		msg, ok := <-l.receivedMessage
		if !ok {
			break
		}
		if requestedShutdown {
			user := msg.Node()
			user.In() <- reply.LobbyNotFound(l.Id)
			user.SetOut(nil)
			continue
		}
		l.processMessage(msg)
	}
}

func (l lobby) processMessage(msg message.Message) {
	user := msg.Node()
	if l.members.NodeInLobby(user) {
		stillInLobby := l.processInternalMessage(msg)
		if stillInLobby {
			user.SetOut(l.receivedMessage)
		}
	} else {
		l.processExternalMessage(msg)
	}
}

func (l lobby) isActive() bool {
	return l.members.IsActive()
}

func (l lobby) processExternalMessage(msg message.Message) {
	user := msg.Node()
	switch msg.Header() {
	case header.JoinLobby:
		l.members.Add(user, msg.Body())
		return
	default:
		l.strategy.Handle(msg)
	}
	user.SetOut(nil)
}

func (l lobby) processInternalMessage(msg message.Message) bool {
	user := msg.Node()
	switch msg.Header() {
	case header.UserLocation:
		user.In() <- reply.UserLocation(true)
	case header.LeaveLobby:
		l.members.Remove(user)
		return false
	default:
		l.strategy.Handle(msg)
	}
	return true
}

func (l lobby) shutdown() {
	log.Println("closing lobby ", l.Id)
	l.members.Shutdown()
}
