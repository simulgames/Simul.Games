package reply

import (
	"encoding/json"
	"fmt"
	"simul-app/games/compare"
	"simul-app/server/message/reply/header"
)

func LobbyNotFound(id string) json.RawMessage {
	msg := fmt.Sprintf(`{"lobby":"%s"}`, id)
	return getMsg(header.LobbyNotFound, []byte(msg))
}

func LobbyFound(id, status string) json.RawMessage {
	msg := fmt.Sprintf("{\"lobby\":\"%s\","+
		"						\"status\":\"%s\"}", id, status)
	return getMsg(header.LobbyFound, []byte(msg))
}

func LobbyJoined() json.RawMessage {
	return headerOnly(header.LobbyJoined)
}

func LobbyLeft() json.RawMessage {
	return headerOnly(header.LobbyLeft)
}

func InvalidSyntaxReply() json.RawMessage {
	return headerOnly(header.InvalidSyntaxError)
}

func ServerBusyReply() json.RawMessage {
	return []byte("{\"error\":503}")
}

func NewMemberInLobby(newMember any) json.RawMessage {
	return New(header.MemberJoined, newMember)
}

func MemberLeftLobby(id string) json.RawMessage {
	msg := fmt.Sprintf(`{"id":"%s"}`, id)
	return getMsg(header.MemberLeft, []byte(msg))
}

func GameStarting() json.RawMessage {
	return headerOnly(header.GameStarting)
}

func NewSessionID(sID string) json.RawMessage {
	msg := fmt.Sprintf(`{"sessionID":"%s"}`, sID)
	return getMsg(header.SessionID, []byte(msg))
}

func UserLocation(inLobby bool) json.RawMessage {
	msg := fmt.Sprintf(`{"inLobby":"%v"}`, inLobby)
	return getMsg(header.UserLocation, []byte(msg))
}

func CompareResultClient(guess, status string, matchLevel []compare.MatchLevel, turn int) json.RawMessage {
	msg := fmt.Sprintf(`{"guess":"%s","status":"%s","result":"%v","turn":%d}`, guess, status, matchLevel, turn)
	return getMsg(header.CompareResultClient, []byte(msg))
}

func CompareClientInvalidWord() json.RawMessage {
	return getMsg(header.CompareResultClient, []byte(`{"status":"error"}`))
}

func CompareResultOther(id string, matchLevel []compare.MatchLevel, turn int) json.RawMessage {
	msg := fmt.Sprintf(`{"id":"%s","result":"%v","turn":%d}`, id, matchLevel, turn)
	return getMsg(header.CompareResultOther, []byte(msg))
}

func CompareResultOtherWithGuess(id, guess string, matchLevel []compare.MatchLevel, turn int, status string) json.RawMessage {
	msg := fmt.Sprintf(`{"id":"%s","guess":"%s","result":"%v","turn":%d,"status":"%s"}`, id, guess, matchLevel, turn, status)
	return getMsg(header.CompareResultOther, []byte(msg))
}

func IsGameFinished(gameFinished bool) json.RawMessage {
	msg := fmt.Sprintf(`{"finished":%v}`, gameFinished)
	return getMsg(header.IsGameFinished, []byte(msg))
}
