package strategy

import "simul-app/server/message"

type Strategy interface {
	Handle(msg message.Message)
}

type strategyFactory interface {
	MakeStrategy(members memberList, setter strategySetter)
}

type strategySetter interface {
	SetStrategy(strategy Strategy)
}
