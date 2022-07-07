package member

import (
	"encoding/json"
	"github.com/google/uuid"
	"math/rand"
)

type factory struct {
	colors []string
}

func (f factory) Make(message json.RawMessage) (Member, error) {
	var memberInfo map[string]string
	err := json.Unmarshal(message, &memberInfo)
	newMember := &Member{
		Name:  memberInfo["Name"],
		Color: f.colors[rand.Intn(len(f.colors))],
		ID:    uuid.NewString(),
	}
	return *newMember, err
}

func NewFactory() Factory {
	return &factory{colors: []string{"#2e8b57", "#ff4500", "#1e90ff", "#fa8072", "#dda0dd", "#f0e68c"}}
}
