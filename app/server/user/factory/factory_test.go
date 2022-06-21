package factory

import (
	"errors"
	"net/http"
	"simul-app/server/user/connection"
	"testing"
)

func TestFactoryDoesNotBuildIfErrors(t *testing.T) {
	errorThrower := mockConnection{true}
	userFactory := New(errorThrower, builderThatPanicsIfAskedToBuild{})
	go userFactory.ServeHTTP(nil, nil)
}

func TestFactoryBuildsIfNoError(t *testing.T) {
	noError := mockConnection{false}
	built := make(chan bool)
	userFactory := New(noError, mockBuilder{built})
	userFactory.ServeHTTP(nil, nil)
	<-built
}

type mockConnection struct {
	throwError bool
}

func (m mockConnection) Connect(_ http.ResponseWriter, _ *http.Request) (connection.Connection, error) {
	if m.throwError {
		return nil, errors.New("throwing error")
	}
	return nil, nil
}

type mockBuilder struct {
	built chan bool
}

func (m mockBuilder) Build(_ connection.Connection) {
	m.built <- true
}

type builderThatPanicsIfAskedToBuild struct {
}

func (m builderThatPanicsIfAskedToBuild) Build(_ connection.Connection) {
	panic("asked to build!")
}
