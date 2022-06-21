package builder

import (
	"encoding/json"
	"errors"
	"simul-app/server/message"
	"simul-app/server/user/connection"
	"testing"
)

func TestBuilderGivesNewSessionID(t *testing.T) {
	registered := make(chan message.Message)
	testBuilder := New(registered)
	msgOut := make(chan json.RawMessage)
	gotChannel := make(chan chan json.RawMessage)
	go testBuilder.Build(mockConnection{
		msgIn:      []byte(""),
		msgOut:     msgOut,
		gotChannel: gotChannel,
	})
	<-gotChannel
	<-msgOut
}

func TestBuilderClosesConnectionIfReadError(t *testing.T) {
	testBuilder := New(nil)
	closedSignal := make(chan bool)
	go testBuilder.Build(mockConnection{err: errors.New("read error"), closedSignal: closedSignal})
	if closed := <-closedSignal; closed != true {
		t.Fail()
	}
}

func TestBuilderPassesOnConnectionIfHasSessionID(t *testing.T) {
	sessionIDs := make(map[string]chan connection.Connection)
	newConnection := make(chan connection.Connection)
	sessionID := "hello, world!"
	sessionIDs[sessionID] = newConnection
	testBuilder := builder{sessionIDs: sessionIDs}
	go testBuilder.Build(mockConnection{msgIn: []byte(sessionID)})
	<-newConnection
}
