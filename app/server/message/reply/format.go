package reply

import (
	"encoding/json"
	"fmt"
	"log"
	"simul-app/server/message/reply/header"
)

func New(h header.Header, payload any) json.RawMessage {
	body, err := json.Marshal(payload)
	if err != nil {
		log.Print(err)
		return headerOnly(header.Error)
	}
	return getMsg(h, body)
}

func getMsg(h header.Header, b json.RawMessage) json.RawMessage {
	start := fmt.Sprintf(`{"header":"%s","body":`, h)
	body := append([]byte(start), b...)
	return append(body, []byte("}")...)
}

func headerOnly(h header.Header) json.RawMessage {
	msg := fmt.Sprintf(`{"header":"%s"}`, h)
	return []byte(msg)
}
