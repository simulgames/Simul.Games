package mediator

import (
	"simul-app/server/message"
	"simul-app/server/message/reply"
	"testing"
)

func TestSendsMessageToMessageReplier(t *testing.T) {
	sentMessage := make(chan string)
	spy := mockReplier{sentMessage}
	msgToLobbies := make(chan message.Message)
	mediator := lobbyMediator{replier: spy, msgToLobbies: msgToLobbies}
	go mediator.run()
	msgToLobbies <- message.New(nil, reply.RequestEmpty())
	outGoingMessage := <-sentMessage
	if outGoingMessage != string(reply.RequestEmpty()) {
		t.Fail()
	}
}

func TestCloseLobbyClosesLobby(t *testing.T) {
	lobbyList := make(map[string]chan message.Message)
	id := "hello, world"
	closedLobby := make(chan message.Message)
	lobbyList[id] = closedLobby

	mediator := lobbyMediator{
		lobbies: lobbyList,
		toClose: make(chan string),
	}
	go mediator.run()
	mediator.toClose <- id
	_, ok := <-closedLobby
	if ok {
		t.Fail()
	}
}

type mockReplier struct {
	sentMessage chan string
}

func (m mockReplier) HandleReply(message message.Message) {
	m.sentMessage <- string(message.Content())
}
