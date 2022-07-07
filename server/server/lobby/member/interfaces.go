package member

import (
	"encoding/json"
)

type Factory interface {
	Make(msg json.RawMessage) (Member, error)
}
