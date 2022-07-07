package replier

import (
	"encoding/json"
	"simul-app/server/message"
	"simul-app/server/message/reply"
	"testing"
)

func TestLobbyDoesNotExist(t *testing.T) {
	replier := Replier{Lobbies: make(map[string]chan message.Message)}
	lobbyID := "696969"
	msgOut := reply.RequestLobby(lobbyID)
	msgFromReplier := make(chan json.RawMessage)
	node := mockNode{msgFromReplier}
	msg := message.New(node, msgOut)
	go replier.HandleReply(msg)
	expectedReply := reply.LobbyNotFound(lobbyID)
	if gotReply := <-msgFromReplier; string(gotReply) != string(expectedReply) {
		t.Fail()
	}
}

func TestLobbyExistsSentRequest(t *testing.T) {
	lobbies := make(map[string]chan message.Message)
	lobbyID := "696969"
	msgToLobby := make(chan message.Message)
	lobbies[lobbyID] = msgToLobby
	replier := Replier{Lobbies: lobbies}
	msgOut := reply.RequestLobby(lobbyID)
	node := mockNode{}
	msg := message.New(node, msgOut)
	go replier.HandleReply(msg)

	if gotReply := <-msgToLobby; string(gotReply.Content()) != string(msgOut) {
		t.Fail()
	}
}

func TestReturnsErrorWhenInvalidMessageFormat(t *testing.T) {
	replier := Replier{}
	msgFromReplier := make(chan json.RawMessage)
	node := mockNode{msgFromReplier}
	go replier.HandleReply(message.New(node, nil))
	expectedReply := reply.InvalidSyntaxReply()
	if gotReply := <-msgFromReplier; string(gotReply) != string(expectedReply) {
		t.Fail()
	}
}

func TestMakeLobby(t *testing.T) {
	done := make(chan struct{})
	replier := Replier{Factory: mockFactory{done: done}}
	makeLobbyMessage := reply.RequestMakeLobby()
	replier.HandleReply(message.New(nil, makeLobbyMessage))
	<-done
}

func TestJoinNonExistentLobby(t *testing.T) {
	lobbies := make(map[string]chan message.Message)
	replier := Replier{Lobbies: lobbies}
	lobbyID := "696969"
	msgFromReplier := make(chan json.RawMessage)
	node := mockNode{msgFromReplier}
	joinLobbyRequest := reply.RequestJoinLobby(lobbyID)
	go replier.HandleReply(message.New(node, joinLobbyRequest))
	if gotReply := <-msgFromReplier; string(gotReply) != string(reply.LobbyNotFound(lobbyID)) {
		t.Fail()
	}
}

func TestJoinExistingLobby(t *testing.T) {
	lobbies := make(map[string]chan message.Message)
	replier := Replier{Lobbies: lobbies}
	lobbyID := "696969"
	msg := make(chan message.Message)
	lobbies[lobbyID] = msg
	joinLobbyRequest := reply.RequestJoinLobby(lobbyID)
	go replier.HandleReply(message.New(nil, joinLobbyRequest))
	if lobbyMsg := <-msg; string(lobbyMsg.Content()) != string(joinLobbyRequest) {
		t.Fail()
	}
}

type mockFactory struct {
	done chan struct{}
}

func (m mockFactory) Make(_ message.Message) {
	close(m.done)
}

type mockNode struct {
	msgFromReplier chan json.RawMessage
}

func (m mockNode) In() chan json.RawMessage {
	return m.msgFromReplier
}

func (m mockNode) SetOut(_ chan<- message.Message) {
	return
}

func (m mockNode) ID() message.ID {
	return nil
}
