package builder

import (
	"encoding/json"
	"github.com/google/uuid"
	"simul-app/server/message"
	"simul-app/server/message/reply"
	users "simul-app/server/user"
	"simul-app/server/user/ID"
	"simul-app/server/user/connection"
)

type builder struct {
	sessionIDs   map[string]chan connection.Connection
	msgToLobbies chan<- message.Message
	idGenerator  users.IDGenerator
}

func (b builder) make(c connection.Connection) *user {
	newConnection := make(chan connection.Connection)
	sessionID := uuid.NewString()
	usr := &user{
		newConnection:     newConnection,
		msgFromConnection: make(chan json.RawMessage),
		msgFromServer:     make(chan json.RawMessage),
		listener:          make(chan chan<- message.Message),
		userID:            b.idGenerator.Generate(),
		defaultListener:   b.msgToLobbies,
	}
	go usr.writeLoop(c)
	b.sessionIDs[sessionID] = newConnection
	c.ReadTo(usr.msgFromConnection)
	_ = c.Write(reply.NewSessionID(sessionID))
	return usr
}

func (b builder) Build(connection connection.Connection, sessionID string) {
	if sessionID != "" {
		newConn, ok := b.sessionIDs[sessionID]
		if ok {
			newConn <- connection
			return
		}
	}
	usr := b.make(connection)
	go usr.readLoop()
	usr.SetOut(nil)
}

func New(msgToLobbies chan<- message.Message) users.Builder {
	idGenerator := ID.New()
	return builder{
		sessionIDs:   make(map[string]chan connection.Connection),
		msgToLobbies: msgToLobbies,
		idGenerator:  idGenerator,
	}
}
