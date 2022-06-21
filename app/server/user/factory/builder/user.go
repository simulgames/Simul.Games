package builder

import (
	"encoding/json"
	"simul-app/server/message"
	"simul-app/server/user/connection"
)

type user struct {
	newConnection <-chan connection.Connection

	msgFromConnection chan json.RawMessage
	msgFromServer     chan json.RawMessage
	listener          chan chan<- message.Message
	defaultListener   chan<- message.Message

	userID message.ID
}

func (usr user) In() chan json.RawMessage {
	return usr.msgFromServer
}

func (usr user) SetOut(listener chan<- message.Message) {
	if listener != nil {
		usr.listener <- listener
	} else {
		usr.listener <- usr.defaultListener
	}
}

func (usr user) readLoop() {
	for {
		msgToServer := <-usr.listener
		msg, ok := <-usr.msgFromConnection
		if !ok {
			close(usr.listener)
			break
		}
		msgToServer <- message.New(usr, msg)
	}
}

func (usr user) writeLoop(initialConnection connection.Connection) {
	connections := []connection.Connection{initialConnection}
	for {
		//		if len(usr.connections) == 0 {
		//			close(usr.msgFromConnection)
		//		}
		select {
		case conn := <-usr.newConnection:
			connections = append(connections, conn)
			conn.ReadTo(usr.msgFromConnection)
		case msg, ok := <-usr.msgFromServer:
			if !ok {
				for i := range connections {
					go connections[i].Close()
				}
				break
			}
			badConnections := &[]int{}
			for i := range connections {
				conn := connections[i]
				err := conn.Write(msg)
				if err != nil {
					*badConnections = append(*badConnections, i)
					go conn.Close()
				}
			}
			for i := 0; i < len(*badConnections); i++ { // todo aAAAAAAAAAAA
				connectionId := (*badConnections)[i] - i
				connections = append(connections[:connectionId], connections[connectionId+1:]...)
			}
		}
	}
}
