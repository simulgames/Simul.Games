package factory

import (
	"encoding/json"
	"simul-app/server/message"
	"simul-app/server/message/reply"
	"testing"
)

/*
func TestLobbyWithManyUsersShutsDownGracefully(t *testing.T) {
	members := make(map[message.Node]member.Member)
	usersToAdd := rand.Intn(200)

	messagesReceived := &[]chan json.RawMessage{}
	usersToYield := &[]chan bool{}

	for i := 0; i < usersToAdd; i++ {
		msgReceived := make(chan json.RawMessage, 1) // when closing, the user will receive a message
		wasYielded := make(chan bool, 1)
		*messagesReceived = append(*messagesReceived, msgReceived)
		*usersToYield = append(*usersToYield, wasYielded)
		members[mockNode{id: fmt.Sprint(i), msgReceived: msgReceived, wasYielded: wasYielded}] = member.Member{}
	}
	lby := lobby{
		members:       members,
		memberFactory: nil,
	}

	go func() {
		lby.shutdown()
	}()

	usersToldLeft := 0
	for i := 0; i < usersToAdd; i++ {
		msg := <-(*messagesReceived)[i]
		if string(msg) == string(reply.LobbyLeft()) {
			usersToldLeft++
		}
	}

	usersYielded := 0
	for i := 0; i < usersToAdd; i++ {
		msg := <-(*usersToYield)[i]
		if msg == true {
			usersYielded++
		}
	}

	if usersToAdd != usersToldLeft || usersYielded != usersToAdd {
		t.Fail()
	}

} */

func TestClosingLobbyWillStopRunning(t *testing.T) {
	wasShutDown := make(chan bool)
	receivedMessage := make(chan message.Message)
	lobbyId := "hello, world"
	newLobby := lobby{
		members:         mockMembers{isActive: true, wasShutDown: wasShutDown},
		Id:              lobbyId,
		receivedMessage: receivedMessage,
	}
	go func() {
		newLobby.run()
	}()
	close(receivedMessage)
	if !<-wasShutDown {
		t.Fail()
	}
}

func TestLobbyWithNoMemberAsksToBeClosed(t *testing.T) {
	lobbyCloseRequest := make(chan string)
	lobbyId := "hello, world"
	newLobby := lobby{
		members:     mockMembers{isActive: false},
		Id:          lobbyId,
		lobbyClosed: lobbyCloseRequest,
	}
	go newLobby.run()
	if lobbyClosedID := <-lobbyCloseRequest; lobbyId != lobbyClosedID {
		t.Fail()
	}
}

/*
func TestLobbyNewMemberIsAdded(t *testing.T) {
	members := make(map[message.Node]member.Member)

	receivedMessage := make(chan message.Message)
	oldMemberMsgIn := make(chan json.RawMessage)
	members[mockNode{msgReceived: oldMemberMsgIn}] = member.Member{}
	lobbyId := "hello, world"
	newLobby := lobby{
		members:         mockMembers{},
		memberFactory:   mockMemberFactory{},
		Id:              lobbyId,
		receivedMessage: receivedMessage,
		lobbyClosed:     nil,
	}
	inMsg := make(chan json.RawMessage)
	newMember := mockNode{msgReceived: inMsg}
	go newLobby.addNewMember(newMember, nil)
	if msg := <-oldMemberMsgIn; string(msg) != string(reply.NewMemberInLobby(member.Member{})) {
		t.Fail()
	}
	if msg := <-inMsg; string(msg) != string(reply.LobbyJoined()) {
		t.Fail()
	}
}

func TestLobbyRefusesAndYieldsInvalidMember(t *testing.T) {
	connections := make(map[message.Node]member.Member)
	connections[mockNode{}] = member.Member{}
	receivedMessage := make(chan message.Message)
	lobbyId := "hello, world"
	newLobby := lobby{
		members:         mockMembers{},
		memberFactory:   mockMemberFactory{errors.New("invalid member")},
		receivedMessage: receivedMessage,
		Id:              lobbyId,
	}
	go newLobby.run()
	errorMessage := make(chan json.RawMessage)
	wasYielded := make(chan bool)
	newMember := mockNode{msgReceived: errorMessage, wasYielded: wasYielded}
	receivedMessage <- message.New(newMember, reply.RequestJoinLobby(lobbyId))
	if err := <-errorMessage; string(err) != string(reply.InvalidSyntaxReply()) {
		t.Fail()
	}
	<-wasYielded
}*/

func TestLobbyThatIsShuttingDownRefusesNewMembers(t *testing.T) {
	receivedMessage := make(chan message.Message)
	lobbyId := "hello, world"
	newLobby := lobby{
		members:         mockMembers{},
		receivedMessage: receivedMessage,
		Id:              lobbyId,
	}
	go newLobby.run()
	errorMessage := make(chan json.RawMessage)
	wasYielded := make(chan bool)
	newMember := mockNode{msgReceived: errorMessage, wasYielded: wasYielded}
	receivedMessage <- message.New(newMember, nil)
	if err := <-errorMessage; string(err) != string(reply.LobbyNotFound(lobbyId)) {
		t.Fail()
	}
	<-wasYielded
}

type mockMembers struct {
	isActive    bool
	wasShutDown chan bool
}

func (m mockMembers) IsActive() bool {
	return m.isActive
}

func (m mockMembers) NodeInLobby(node message.Node) bool {
	//TODO implement me
	panic("implement me")
}

func (m mockMembers) Add(node message.Node, memberJSON json.RawMessage) {
	//TODO implement me
	panic("implement me")
}

func (m mockMembers) Remove(node message.Node) {
	//TODO implement me
	panic("implement me")
}

func (m mockMembers) Shutdown() {
	m.wasShutDown <- true
}

/*
func TestInvalidSyntaxOrderReturnsSyntaxError(t *testing.T) {
	msgReceived := make(chan json.RawMessage)
	user := mockNode{msgReceived: msgReceived}
	newLobby := lobby{}
	invalidMessage := message.New(user, nil)
	go newLobby.processInternalMessage(invalidMessage)
	msgFromLobby := <-msgReceived
	if string(msgFromLobby) != string(reply.InvalidSyntaxReply()) {
		t.Fail()
	}

func TestUserMessagesProcessed(t *testing.T) {
	msgIn := make(chan json.RawMessage)
	msgOut := make(chan json.RawMessage)
	user := mockNode{
		msgReceived: msgIn,
		msgOut:      msgOut,
	}
	members := make(map[message.Node]member.Member)
	members[user] = member.Member{}
	newLobby := lobby{
		members: members,
	}
	go newLobby.processUserMessages()
	msgOut <- reply.RequestEmpty()
	msgFromLobby := <-msgIn
	if string(msgFromLobby) != string(reply.InvalidSyntaxReply()) {
		t.Fail()
	}
}
}*/
