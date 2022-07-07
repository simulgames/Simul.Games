package factory

import (
	"encoding/json"
	"simul-app/server/message"
	"simul-app/server/message/reply"
	"testing"
)

func TestNoLobbyIDsFreeSendsErrorAndYieldsNode(t *testing.T) {
	onlyIdAvailable := "hello, world!"
	lobbies := make(map[string]chan message.Message)
	lobbies[onlyIdAvailable] = nil
	factory := lobbyFactory{
		lobbies:     lobbies,
		generator:   mockGenerator{onlyIdAvailable},
		lobbyClosed: nil,
	}
	msgReceived := make(chan json.RawMessage)
	wasYielded := make(chan bool)
	msg := message.New(mockNode{msgReceived: msgReceived, wasYielded: wasYielded}, nil)
	go factory.Make(msg)
	errorMessage := <-msgReceived
	if string(errorMessage) != string(reply.ServerBusyReply()) {
		t.Fail()
	}
	<-wasYielded
}

func TestLobbyInvalidSettingsThrowErrorAndYieldsNode(t *testing.T) {
	factory := lobbyFactory{generator: mockGenerator{}}
	msgReceived := make(chan json.RawMessage)
	wasYielded := make(chan bool)
	msg := message.New(mockNode{msgReceived: msgReceived, wasYielded: wasYielded}, reply.RequestInvalid())
	go factory.Make(msg)
	errorMessage := <-msgReceived
	if string(errorMessage) != string(reply.InvalidSyntaxReply()) {
		t.Fail()
	}
	<-wasYielded
}

/*
func TestLobbyHappyPath(t *testing.T) {
	lobbies := make(map[string]chan message.Message)
	id := "hello, world"
	factory := lobbyFactory{lobbies: lobbies, generator: mockGenerator{id}, memberFactory: mockMemberFactory{}}
	msgReceived := make(chan json.RawMessage)
	msg := message.New(mockNode{msgReceived: msgReceived}, reply.RequestMakeLobby())
	go factory.Make(msg)
	lobbyMade := <-msgReceived
	if string(lobbyMade) != string(reply.LobbyJoined()) {
		t.Fail()
	}
} */

type mockGenerator struct {
	onlyIdAvailable string
}

func (m mockGenerator) Generate() string {
	return m.onlyIdAvailable
}

type mockID struct {
	id string
}

func (m mockID) ID() string {
	return m.id
}

type mockNode struct {
	msgReceived chan json.RawMessage
	id          string
	wasYielded  chan bool
}

func (m mockNode) SetOut(listener chan<- message.Message) {
	if listener == nil {
		m.wasYielded <- true
	}
}

func (m mockNode) In() chan json.RawMessage {
	return m.msgReceived
}

func (m mockNode) ID() message.ID {
	return mockID{m.id}
}
