package factory

import (
	"net/http"
	"simul-app/server/user"
	"simul-app/server/user/connection"
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
	go f.builder.Build(conn)
}

func New(connectionFactory connection.Factory, builder user.Builder) http.Handler {
	return factory{
		connectionFactory: connectionFactory,
		builder:           builder,
	}
}
