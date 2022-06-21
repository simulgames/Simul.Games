package strategy

import (
	"encoding/json"
	"fmt"
	"simul-app/server/lobby/member"
	"simul-app/server/message"
	"simul-app/server/message/reply"
	"simul-app/server/message/reply/header"
)

type baseStrategy struct {
	members         member.List
	hasStarted      bool
	lobby           lobbyData
	currentStrategy Strategy
}

func (base *baseStrategy) SetStrategy(strategy Strategy) {
	base.hasStarted = true
	base.currentStrategy = strategy
}

func (base *baseStrategy) Handle(msg message.Message) {
	user := msg.Node()
	switch msg.Header() {
	case header.GetLobbyDataExternal:
		lobbyStatus := fmt.Sprintf("%s - Playing Word Duel", base.lobby.LobbyName)
		user.In() <- reply.LobbyFound(base.lobby.LobbyID, lobbyStatus)
	case header.GetLobbyDataInternal:
		marshalled := base.members.AsArray()
		clientID := base.members.GetID(user)
		user.In() <- reply.New(header.LobbyData, lobbyDataExternal{
			Members:    marshalled,
			ClientID:   clientID,
			HasStarted: base.hasStarted,
			Lobby:      base.lobby,
		})
	default:
		base.currentStrategy.Handle(msg)
	}
}

type lobbySettings struct {
	Name string // todo - sanitize!
}

func New(lobbyOptions json.RawMessage, LobbyId string, members member.List) (Strategy, error) {
	settings := &lobbySettings{}
	err := json.Unmarshal(lobbyOptions, settings)
	if err != nil {
		return nil, err
	}
	lobbyStrategy := &baseStrategy{
		members: members,
		lobby: lobbyData{
			LobbyName: settings.Name,
			LobbyID:   LobbyId,
			HostID:    members.HostID(),
		},
		hasStarted: false,
	}
	lobbyStrategy.currentStrategy = &PreGameStrategy{
		members:         &members,
		strategySetter:  lobbyStrategy,
		strategyFactory: WordDuelFactory{},
	}
	return lobbyStrategy, nil
}
