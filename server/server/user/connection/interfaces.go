package connection

import (
	"encoding/json"
	"net/http"
)

type Factory interface {
	Connect(w http.ResponseWriter, r *http.Request) (Connection, error)
}

type Connection interface {
	Read() ([]byte, error)
	Write([]byte) error
	Close()
	ReadTo(out chan json.RawMessage)
}
