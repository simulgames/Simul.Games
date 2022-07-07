package ID

import (
	"github.com/google/uuid"
	"simul-app/server/message"
	"simul-app/server/user"
)

type ID struct {
	id string
}

func (id ID) ID() string {
	return id.id
}

type idGenerator struct {
}

func (i idGenerator) Generate() message.ID {
	return ID{id: uuid.NewString()}
}

func New() user.IDGenerator {
	uuid.EnableRandPool()
	return idGenerator{}
}
