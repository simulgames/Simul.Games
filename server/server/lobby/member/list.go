package member

import (
	"encoding/json"
	"simul-app/server/message"
	"simul-app/server/message/reply"
)

type List struct {
	members      map[message.Node]Member
	factory      Factory
	nodeListener chan message.Message
	hostID       string
}

func (l List) IsActive() bool {
	return len(l.members) != 0
}

func (l List) NodeInLobby(node message.Node) bool {
	_, memberInLobby := l.members[node]
	return memberInLobby
}

func (l *List) AddHost(node message.Node, memberJSON json.RawMessage) {
	l.Add(node, memberJSON)
	id := l.members[node].ID
	l.hostID = id
}

func (l List) Add(node message.Node, memberJSON json.RawMessage) {
	lobbyMember, err := l.factory.Make(memberJSON)
	if err != nil {
		node.In() <- reply.InvalidSyntaxReply()
		node.SetOut(nil)
	}
	l.Send(reply.NewMemberInLobby(lobbyMember))
	l.members[node] = lobbyMember
	node.In() <- reply.LobbyJoined()
	node.SetOut(l.nodeListener)
}

func (l List) removeSilently(node message.Node) string {
	memberId := l.members[node].ID
	node.In() <- reply.LobbyLeft()
	delete(l.members, node)
	node.SetOut(nil)
	return memberId
}

func (l List) Remove(node message.Node) {
	memberId := l.removeSilently(node)
	l.Send(reply.MemberLeftLobby(memberId))
}

func (l List) Shutdown() {
	for member := range l.members {
		l.removeSilently(member)
	}
}

func (l List) Send(msg json.RawMessage) {
	for node := range l.members {
		node.In() <- msg
	}
}

func (l List) SendExcept(msg json.RawMessage, except string) {
	for node := range l.members {
		if l.members[node].ID != except {
			node.In() <- msg
		}
	}
}

func (l List) AsArray() []Member {
	array := make([]Member, 0, len(l.members))
	for _, val := range l.members {
		array = append(array, val)
	}
	return array
}

func (l *List) IsHost(node message.Node) bool {
	return l.members[node].ID == l.hostID
}

func (l *List) HostID() string {
	return l.hostID
}

func (l List) GetID(node message.Node) string {
	return l.members[node].ID
}

func NewList(nodeListener chan message.Message) List {
	return List{
		members:      make(map[message.Node]Member),
		factory:      NewFactory(),
		nodeListener: nodeListener,
	}
}
