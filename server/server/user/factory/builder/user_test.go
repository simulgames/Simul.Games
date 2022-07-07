package builder

import (
	"encoding/json"
	"errors"
	"simul-app/server/message"
	"simul-app/server/message/reply"
	"simul-app/server/user/connection"
	"testing"
)

func TestReadLoopEndsWhenNoMoreConnections(t *testing.T) {
	msgFromConnection := make(chan json.RawMessage)
	usr := user{
		msgFromConnection: msgFromConnection,
		listener:          make(chan chan<- message.Message),
	}
	go func() {
		usr.listener <- make(chan<- message.Message)
	}()
	close(msgFromConnection)
	usr.readLoop()
}

func TestUserForwardsMessageToConnection(t *testing.T) {
	msgFromConnection := make(chan json.RawMessage)
	msgToUser := make(chan json.RawMessage)
	usr := user{
		msgFromServer: msgToUser,
	}
	msgTxt := "hello world"
	go usr.writeLoop(mockConnection{msgOut: msgFromConnection})
	usr.In() <- []byte(msgTxt)
	msg := <-msgFromConnection
	if msgTxt != string(msg) {
		t.Fail()
	}
}

func TestUserForwardsMessageToServerFromConnection(t *testing.T) {
	msgFromConnection := make(chan json.RawMessage)
	listener := make(chan chan<- message.Message)
	serverListener := make(chan message.Message)
	msgTxt := reply.RequestEmpty()
	usr := user{
		msgFromConnection: msgFromConnection,
		listener:          listener,
	}
	go usr.readLoop()
	usr.SetOut(serverListener)
	msgFromConnection <- msgTxt

	msg, ok := <-serverListener

	if string(msgTxt) != string(msg.Content()) || !ok {
		t.Fail()
	}
}

func TestUserClosesConnectionsWhenMessageChannelClosed(t *testing.T) {
	msgToUser := make(chan json.RawMessage)
	closedSignal := make(chan bool)
	usr := user{
		msgFromServer: msgToUser,
	}
	go usr.writeLoop(mockConnection{closedSignal: closedSignal})
	select {
	case <-closedSignal:
		t.Fail()
	default:
		close(msgToUser)
		<-closedSignal
	}
}

// todo - this is off until refactored!
/*
func TestWriteLoopEndsAndClosesConnectionIfNoConnectionsToWriteTo(t *testing.T) {
	msgFromConnection := make(chan json.RawMessage)
	usr := user{
		connections:       []connection.Connection{},
		msgFromConnection: msgFromConnection,
	}
	usr.writeLoop()
	if _, ok := <-msgFromConnection; ok {
		t.Fail()
	}
} */

func TestWriteLoopAddsConnection(t *testing.T) {
	msgFromConnection := make(chan json.RawMessage)
	newConnection := make(chan connection.Connection)
	usr := user{
		msgFromConnection: msgFromConnection,
		newConnection:     newConnection,
	}
	go usr.writeLoop(mockConnection{})
	gotChannel := make(chan chan json.RawMessage)
	newConnection <- mockConnection{gotChannel: gotChannel}
	if ch := <-gotChannel; ch != msgFromConnection {
		t.Fail()
	}
}

func TestWriteLoopClosesConnectionThatErrors(t *testing.T) {
	msgFromServer := make(chan json.RawMessage)
	msgFromConnection := make(chan json.RawMessage)
	closedSignal := make(chan bool)
	usr := user{
		msgFromConnection: msgFromConnection,
		msgFromServer:     msgFromServer,
	}
	go usr.writeLoop(mockConnection{err: errors.New("close me"), closedSignal: closedSignal})
	msgFromServer <- []byte("")
	<-closedSignal
}

type mockConnection struct {
	msgIn        []byte
	err          error
	msgOut       chan json.RawMessage
	closedSignal chan bool
	gotChannel   chan chan json.RawMessage
}

func (c mockConnection) Read() ([]byte, error) {
	select {
	case <-c.closedSignal:
		return nil, errors.New("")
	default:
		return c.msgIn, c.err
	}
}

func (c mockConnection) ReadTo(out chan json.RawMessage) {
	c.gotChannel <- out
}

func (c mockConnection) Write(message []byte) error {
	if c.err != nil {
		return c.err
	}
	c.msgOut <- message
	return nil
}

func (c mockConnection) Close() {
	c.closedSignal <- true
}
