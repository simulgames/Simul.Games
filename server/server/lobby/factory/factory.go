package factory

import (
	"encoding/json"
	"errors"
	lby "simul-app/server/lobby"
	"simul-app/server/lobby/factory/options"
	"simul-app/server/lobby/lobbyID"
	"simul-app/server/lobby/member"
	"simul-app/server/lobby/strategy"
	"simul-app/server/message"
	"simul-app/server/message/reply"
)

type lobbyFactory struct {
	lobbies     map[string]chan message.Message
	generator   lobbyID.Generator
	lobbyClosed chan<- string
}

func (f lobbyFactory) Make(msg message.Message) {
	host := msg.Node()
	uniqueLobbyCode, err := f.findUniqueLobbyCode()
	if err != nil {
		host.In() <- reply.ServerBusyReply()
		host.SetOut(nil)
		return
	}
	newLobby, err := f.fromSettings(uniqueLobbyCode, host, msg.Body())
	if err != nil {
		host.In() <- reply.InvalidSyntaxReply()
		host.SetOut(nil)
		return
	}
	f.lobbies[uniqueLobbyCode] = newLobby
}

func (f lobbyFactory) fromSettings(id string, host message.Node, newLobbyOptions json.RawMessage) (chan message.Message, error) {
	messageReceived := make(chan message.Message)
	members := member.NewList(messageReceived)
	l := &lobby{
		Id:              id,
		receivedMessage: messageReceived,
		lobbyClosed:     f.lobbyClosed,
	}
	lobbyOptions := &options.NewLobby{}
	err := json.Unmarshal(newLobbyOptions, lobbyOptions)
	if err != nil {
		return nil, err
	}
	members.AddHost(host, lobbyOptions.Host)
	l.members = members
	lobbyStrategy, err := strategy.New(lobbyOptions.Lobby, l.Id, members)
	if err != nil {
		return nil, err
	}
	l.strategy = lobbyStrategy
	go l.run()
	return messageReceived, err
}

func (f lobbyFactory) findUniqueLobbyCode() (string, error) {
	for i := 0; i <= 100; i++ {
		uniqueLobbyID := f.generator.Generate()
		_, occupied := f.lobbies[uniqueLobbyID]
		if !occupied {
			return uniqueLobbyID, nil
		}
	}
	return "", errors.New("no unique lobbies")
}

func New(lobbies map[string]chan message.Message, lobbyClosed chan string) lby.Factory {
	return lobbyFactory{
		lobbies:     lobbies,
		generator:   lobbyID.NewGenerator(),
		lobbyClosed: lobbyClosed,
	}
}
