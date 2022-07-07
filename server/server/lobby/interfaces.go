package lobby

import (
	"simul-app/server/message"
)

type Factory interface {
	Make(msg message.Message)
}
