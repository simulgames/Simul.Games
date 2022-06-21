package strategy

import (
	"encoding/json"
	"simul-app/server/message"
	"simul-app/server/message/reply"
	"simul-app/server/message/reply/header"
)

type memberList interface {
	Send(rawMessage json.RawMessage)
	SendExcept(rawMessage json.RawMessage, except string)
	IsHost(node message.Node) bool
	GetID(node message.Node) string
	NodeInLobby(node message.Node) bool
}

type PreGameStrategy struct {
	members         memberList
	strategyFactory strategyFactory
	strategySetter  strategySetter
}

func (p PreGameStrategy) Handle(msg message.Message) {
	user := msg.Node()
	switch msg.Header() {
	case header.StartGame:
		if !p.members.IsHost(user) {
			user.In() <- reply.InvalidSyntaxReply()
			break
		}
		p.startGame()
	}
}

func (p PreGameStrategy) startGame() {
	p.strategyFactory.MakeStrategy(p.members, p.strategySetter)
	p.members.Send(reply.GameStarting())
}
