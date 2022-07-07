package user

import (
	"simul-app/server/message"
	"simul-app/server/user/connection"
)

type Builder interface {
	Build(connection connection.Connection, sessionID string)
}

type IDGenerator interface {
	Generate() message.ID
}
