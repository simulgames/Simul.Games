package websocket

import (
	"github.com/gavv/httpexpect/v2"
	"log"
	"net/http"
	"net/http/httptest"
	"simul-app/server/user/connection"
	"testing"
)

type FakeEndPoint struct {
	conn chan connection.Connection
}

func (f FakeEndPoint) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	conn, _ := New("https://simul.games").Connect(writer, request)
	f.conn <- conn
}

func setUpFakeEndPoint(t *testing.T, conn chan connection.Connection) *httpexpect.Websocket {
	endPoint := FakeEndPoint{conn: conn}
	server := httptest.NewServer(endPoint)
	log.Println(server.URL)
	e := httpexpect.New(t, server.URL)
	return e.GET("/").WithHeader("Origin", "https://simul.games").WithWebsocketUpgrade().Expect().Status(http.StatusSwitchingProtocols).Websocket()
}

func readConnection(
	conn connection.Connection,
	err chan error,
	in chan string) {
	for {
		msg, readErr := conn.Read()
		if readErr != nil {
			err <- readErr
			break
		}
		in <- string(msg)
	}
}

func TestSendMessage(t *testing.T) {
	getConn := make(chan connection.Connection)
	ws := setUpFakeEndPoint(t, getConn)
	conn := <-getConn
	msg := "hello, world"
	writeError := conn.Write([]byte(msg))
	if writeError != nil {
		t.Fail()
		return
	}
	if ws.Expect().TextMessage().Body().Raw() != msg {
		t.Fail()
		return
	}
}

func TestReceiveMessage(t *testing.T) {
	conn := make(chan connection.Connection)
	ws := setUpFakeEndPoint(t, conn)
	client := <-conn
	in := make(chan string)
	go readConnection(client, nil, in)
	msgOut := "hello world"
	ws.WriteText(msgOut)
	msgIn := <-in
	if msgIn != string(msgOut) {
		t.Fail()
	}
}

func TestServerClosesSocket(t *testing.T) {
	conn := make(chan connection.Connection)
	ws := setUpFakeEndPoint(t, conn)
	client := <-conn

	client.Close()
	ws.Expect().CloseMessage()
}

func TestClientClosesSocket(t *testing.T) {
	conn := make(chan connection.Connection)
	ws := setUpFakeEndPoint(t, conn)
	client := <-conn
	err := make(chan error)
	go readConnection(client, err, nil)

	ws.Close()
	readErr := <-err
	if readErr.Error() != "websocket: close 1000 (normal)" {
		t.Fail()
	}
}

func TestClientSendsWrongMessageThrowsError(t *testing.T) {
	conn := make(chan connection.Connection)
	ws := setUpFakeEndPoint(t, conn)
	client := <-conn
	err := make(chan error)
	go readConnection(client, err, nil)

	ws.WriteBytesBinary(nil)
	<-err
}
