package options

import "encoding/json"

type NewLobby struct {
	Lobby json.RawMessage `json:"lobby"`
	Host  json.RawMessage `json:"host"`
}
