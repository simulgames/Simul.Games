package member

import (
	"encoding/json"
	"simul-app/server/message"
	"simul-app/server/message/reply"
	"testing"
)

func TestHostIsSet(t *testing.T) {
	msgReceived := make(chan json.RawMessage)
	l := NewList(nil)
	node := mockNode{msgReceived: msgReceived}
	go func() {
		if msg := <-msgReceived; string(msg) != string(reply.LobbyJoined()) {
			t.Fail()
		}
	}()
	l.AddHost(node, []byte(`{"Name":"hello"}`))
	if !l.IsHost(node) {
		t.Fail()
	}
}

type mockNode struct {
	msgReceived chan json.RawMessage
}

func (m mockNode) In() chan json.RawMessage {
	return m.msgReceived
}

func (m mockNode) SetOut(_ chan<- message.Message) {
}
