package websocket

import (
	"encoding/json"
	"errors"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"simul-app/server/user/connection"
)

type gorillaConnection struct {
	connection *websocket.Conn
}

func (g gorillaConnection) Read() ([]byte, error) {
	messageType, messageBytes, readError := g.connection.ReadMessage()
	if readError != nil {
		return nil, readError
	}
	if messageType != websocket.TextMessage {
		return nil, errors.New("unrecognized format")
	}
	return messageBytes, nil
}

func (g gorillaConnection) ReadTo(out chan json.RawMessage) {
	go func() {
		for {
			msg, err := g.Read()
			if err != nil {
				break
			}
			out <- msg
		}
	}()
}

func (g gorillaConnection) Write(msg []byte) error {
	return g.connection.WriteMessage(websocket.TextMessage, msg)
}

func (g gorillaConnection) Close() {
	closeMsg := websocket.FormatCloseMessage(websocket.CloseNormalClosure, "disconnected")
	_ = g.connection.WriteMessage(websocket.CloseMessage, closeMsg)
}

type gorillaFactory struct {
	upgrader websocket.Upgrader
}

func (g gorillaFactory) upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	return g.upgrader.Upgrade(w, r, nil)
}

func (g gorillaFactory) Connect(w http.ResponseWriter, r *http.Request) (connection.Connection, error) {
	webSocket, err := g.upgrade(w, r)
	log.Println("connection request received!")
	if err != nil {
		log.Println(err.Error())
	}
	return gorillaConnection{webSocket}, err
}

func New(url string) connection.Factory {
	return gorillaFactory{
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				origin := r.Header.Get("Origin")
				return origin == url
			},
		},
	}
}
