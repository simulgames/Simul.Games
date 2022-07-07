package replier

import (
	"encoding/json"
	"simul-app/server/lobby"
	"simul-app/server/message"
	"simul-app/server/message/reply"
	"simul-app/server/message/reply/header"
)

type Replier struct {
	Lobbies map[string]chan message.Message
	Factory lobby.Factory
}

type code struct {
	Code string `json:"code"`
}

func (r Replier) HandleReply(msg message.Message) {
	toReply := r.GetReply(msg)
	if toReply != nil {
		user := msg.Node()
		user.In() <- toReply
		user.SetOut(nil)
	}
}

func (r Replier) GetReply(msg message.Message) []byte {
	switch msg.Header() {
	case header.GetLobbyDataExternal:
		return r.passToLobby(msg)
	case header.JoinLobby:
		return r.passToLobby(msg)
	case header.MakeLobby:
		r.Factory.Make(msg)
		return nil
	case header.UserLocation:
		return reply.UserLocation(false)
	default:
		return reply.InvalidSyntaxReply()
	}
}

func (r Replier) passToLobby(msg message.Message) []byte {
	lobbyCode := &code{}
	err := json.Unmarshal(msg.Body(), lobbyCode)
	lobbyID := lobbyCode.Code
	if err != nil || lobbyID == "" {
		return reply.InvalidSyntaxReply()
	}
	l, ok := r.Lobbies[lobbyID]
	if !ok {
		return reply.LobbyNotFound(lobbyID)
	}
	l <- msg
	return nil
}
