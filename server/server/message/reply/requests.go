package reply

import (
	"encoding/json"
	"fmt"
	"simul-app/server/message/reply/header"
)

// expected format of requests to server - for testing

func RequestStartGame() json.RawMessage {
	return headerOnly(header.StartGame)
}

func RequestLobby(code string) json.RawMessage {
	formattedCode := fmt.Sprintf(`{"code":"%s"}`, code)
	return getMsg(header.GetLobbyDataExternal, []byte(formattedCode))
}

func RequestMakeLobby() json.RawMessage {
	return getMsg(header.MakeLobby, []byte(`{"Lobby":{}}`))
}

func RequestJoinLobby(code string) json.RawMessage {
	formattedCode := fmt.Sprintf(`{"code":"%s"}`, code)
	return getMsg(header.JoinLobby, []byte(formattedCode))
}

func RequestEmpty() json.RawMessage {
	return headerOnly(header.Empty)
}

func RequestInvalid() json.RawMessage {
	return []byte("{}")
}
