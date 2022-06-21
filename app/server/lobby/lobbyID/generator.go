package lobbyID

import (
	"fmt"
	"math/rand"
)

var (
	maxCodeExclusive = 1_00_00_00
	minCodeInclusive = 10_00_00
)

type generator struct {
	maxCode int
	minCode int
}

func (g generator) Generate() string {
	id := rand.Intn(g.maxCode-g.minCode) + g.minCode
	return fmt.Sprint(id)
}

func NewGenerator() Generator {
	return generator{maxCode: maxCodeExclusive, minCode: minCodeInclusive}
}
