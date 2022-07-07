package strategy

import (
	"encoding/json"
	"simul-app/server/message"
	"simul-app/server/message/reply"
	"testing"
)

func TestStartGameOrderWhenNotHostReturnsSyntaxError(t *testing.T) {
	msgReceived := make(chan json.RawMessage)
	user := mockNode{
		msgReceived: msgReceived,
	}
	newLobby := PreGameStrategy{
		members: mockMemberList{isHost: false},
	}
	startGameRequest := message.New(user, reply.RequestStartGame())
	go newLobby.Handle(startGameRequest)
	msgFromLobby := <-msgReceived
	if string(msgFromLobby) != string(reply.InvalidSyntaxReply()) {
		t.Fail()
	}
}

func TestStartGameAsHostSendsMessageToAllUsers(t *testing.T) {
	msgSent := make(chan json.RawMessage)
	newLobby := PreGameStrategy{
		strategySetter:  mockLobby{},
		members:         mockMemberList{isHost: true, msgSent: msgSent},
		strategyFactory: mockStrategyFactory{},
	}
	startGameRequest := message.New(nil, reply.RequestStartGame())
	go newLobby.Handle(startGameRequest)
	msgFromLobby := <-msgSent
	if string(msgFromLobby) != string(reply.GameStarting()) {
		t.Fail()
	}
}

type mockStrategyFactory struct {
}

func (m mockStrategyFactory) MakeStrategy(members memberList, setter strategySetter) {
}

type mockMemberList struct {
	msgSent chan json.RawMessage
	isHost  bool
}

func (m mockMemberList) NodeInLobby(node message.Node) bool {
	return true
}

func (m mockMemberList) Send(rawMessage json.RawMessage) {
	m.msgSent <- rawMessage
}

func (m mockMemberList) SendExcept(rawMessage json.RawMessage, except string) {
}

func (m mockMemberList) IsHost(_ message.Node) bool {
	return m.isHost
}

func (m mockMemberList) GetID(node message.Node) string {
	return ""
}

type mockNode struct {
	msgReceived chan json.RawMessage
}

func (mock mockNode) In() chan json.RawMessage {
	return mock.msgReceived
}

func (mock mockNode) SetOut(listener chan<- message.Message) {
}

type mockLobby struct {
}

func (m mockLobby) SetStrategy(strategy Strategy) {

}
