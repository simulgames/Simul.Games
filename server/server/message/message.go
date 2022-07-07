package message

import (
	"encoding/json"
	"log"
	"simul-app/server/message/reply/header"
)

type ID interface {
	ID() string
}

type Message interface {
	Node() Node
	Header() header.Header
	Body() json.RawMessage
	Content() json.RawMessage // todo - remove this
}

type message struct {
	from          Node
	MessageHeader header.Header   `json:"header"`
	MessageBody   json.RawMessage `json:"body"`
	content       json.RawMessage
}

func (m message) MarshalJSON() ([]byte, error) {
	return m.content, nil
}

func (m message) Node() Node {
	return m.from
}

func (m message) Header() header.Header {
	return m.MessageHeader
}

func (m message) Body() json.RawMessage {
	return m.MessageBody
}

func (m message) Content() json.RawMessage {
	return m.content
}

func New(from Node, content json.Marshaler) Message {
	if content != nil {
		payload, _ := content.MarshalJSON()
		msg := &message{from: from, content: payload}
		err := json.Unmarshal(payload, msg)
		if err != nil {
			log.Println("an error occurred when marshalling message: ", err.Error())
			log.Println(string(payload))
			return message{from: from, MessageHeader: header.Error}
		}
		return msg
	}
	return message{from: from}
}
