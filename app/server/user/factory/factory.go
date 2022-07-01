package factory

import (
	"log"
	"net/http"
	"simul-app/server/user"
	"simul-app/server/user/connection"
	"strings"
)

type factory struct {
	connectionFactory connection.Factory
	builder           user.Builder
}

func (f factory) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	conn, err := f.connectionFactory.Connect(w, r)
	if err != nil {
		return
	}
	sessionIDCookie, cookieError := r.Cookie("session_id")
	sessionID := ""
	if cookieError == nil {
		sessionID = sessionIDCookie.Value
		escapedSessionID := strings.Replace(sessionID, "\n", "", -1)
		escapedSessionID = strings.Replace(escapedSessionID, "\r", "", -1)
		log.Println("session reconnected: ", escapedSessionID)
	}
	go f.builder.Build(conn, sessionID)
}

func New(connectionFactory connection.Factory, builder user.Builder) http.Handler {
	return factory{
		connectionFactory: connectionFactory,
		builder:           builder,
	}
}
