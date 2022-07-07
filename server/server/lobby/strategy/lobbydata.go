package strategy

import (
	"simul-app/server/lobby/member"
)

type lobbyDataExternal struct {
	Members    []member.Member `json:"members"`
	ClientID   string          `json:"client-id"`
	HasStarted bool            `json:"has-started"`
	Lobby      lobbyData       `json:"lobby"`
}

type lobbyData struct {
	LobbyName string `json:"name"`
	LobbyID   string `json:"id"`
	HostID    string `json:"host-id"`
}
