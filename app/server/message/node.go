package message

import "encoding/json"

type Node interface {
	In() chan json.RawMessage
	SetOut(listener chan<- Message)
}
