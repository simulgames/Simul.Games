package strategy

import (
	"encoding/json"
	"math/rand"
	"simul-app/games"
	"simul-app/games/compare"
	"simul-app/server/message"
	"simul-app/server/message/reply"
	"simul-app/server/message/reply/header"
	"strings"
)

type wordResults struct {
	Guesses    []string
	Results    [][]compare.MatchLevel
	Turn       int
	Successful bool
}

func (w wordResults) isFinished(maxTurns int) bool {
	return (w.Successful) || (w.Turn == maxTurns)
}

type wordDuel struct {
	hiddenWord     string
	members        memberList
	results        map[message.Node]wordResults
	strategySetter strategySetter
	maxTurns       int
}

type guess struct {
	Word string `json:"guess"`
}

type gameInfo struct {
	Guesses           map[string][]string
	Results           map[string][][]compare.MatchLevel
	Successful        bool
	HasClientFinished bool
	HasFinished       bool
	Word              string
}

func (w wordDuel) GetGameInfo(client message.Node) gameInfo {
	others := make(map[string][][]compare.MatchLevel)
	guesses := make(map[string][]string)
	clientResult, ok := w.results[client]
	if !ok {
		w.results[client] = wordResults{
			Guesses:    []string{},
			Results:    [][]compare.MatchLevel{},
			Turn:       0,
			Successful: false,
		}
		clientResult = w.results[client]
	}
	if clientResult.isFinished(w.maxTurns) {
		for user, results := range w.results {
			guesses[w.members.GetID(user)] = results.Guesses
		}
	} else {
		guesses[w.members.GetID(client)] = append(clientResult.Guesses, "")
	}
	for id, results := range w.results {
		others[w.members.GetID(id)] = results.Results
	}

	word := ""
	if clientResult.isFinished(w.maxTurns) {
		word = w.hiddenWord
	}

	return gameInfo{
		Guesses:           guesses,
		Results:           others,
		Successful:        clientResult.Successful,
		HasClientFinished: clientResult.isFinished(w.maxTurns),
		Word:              word,
		HasFinished:       w.hasFinished(),
	}
}

func (w wordDuel) hasFinished() bool {
	hasFinished := true
	for user, results := range w.results {
		if !w.members.NodeInLobby(user) {
			continue
		}
		if !results.isFinished(w.maxTurns) {
			hasFinished = false
		}
	}
	return hasFinished
}

func (w wordDuel) Handle(msg message.Message) {
	user := msg.Node()
	switch msg.Header() {
	case header.NewGame:
		if !w.members.IsHost(user) || !w.hasFinished() {
			user.In() <- reply.InvalidSyntaxReply()
			break
		}
		WordDuelFactory{}.MakeStrategy(w.members, w.strategySetter)
	case header.IsGameFinished:
		user.In() <- reply.IsGameFinished(w.hasFinished())
	case header.GameInfo:
		user.In() <- reply.New(header.GameInfo, w.GetGameInfo(user))
	case "SubmitWord":
		g := &guess{}
		err := json.Unmarshal(msg.Body(), g)
		if err != nil {
			user.In() <- reply.InvalidSyntaxReply()
			return
		}
		compareResult, compareError := compare.IfValidWord(w.hiddenWord, g.Word)
		if compareError != nil {
			user.In() <- reply.CompareClientInvalidWord()
			return
		}

		currentResult := w.results[user]
		newGuesses := append(currentResult.Guesses, g.Word)
		newResults := append(currentResult.Results, compareResult)
		status := ""
		wasCorrect := compare.IsPerfectMatch(compareResult)
		if wasCorrect || (currentResult.Turn == w.maxTurns-1) {
			status = "finished"
		}
		user.In() <- reply.CompareResultClient(g.Word, status, compareResult, currentResult.Turn)
		id := w.members.GetID(user)

		for member := range w.results {
			if member == user {
				continue
			}
			if w.results[member].isFinished(w.maxTurns) {
				member.In() <- reply.CompareResultOtherWithGuess(id, g.Word, compareResult, currentResult.Turn, status)
			} else {
				member.In() <- reply.CompareResultOther(id, compareResult, currentResult.Turn)
			}
		}
		w.results[user] = wordResults{
			Guesses:    newGuesses,
			Results:    newResults,
			Turn:       currentResult.Turn + 1,
			Successful: wasCorrect,
		}
	}
}

type WordDuelFactory struct {
}

func (w WordDuelFactory) MakeStrategy(members memberList, setter strategySetter) {
	wordPool := games.WordPoolEnglish[5]
	hiddenWord := wordPool[rand.Intn(len(wordPool))]
	game := &wordDuel{
		hiddenWord:     strings.ToUpper(hiddenWord),
		members:        members,
		results:        make(map[message.Node]wordResults),
		strategySetter: setter,
		maxTurns:       6,
	}
	setter.SetStrategy(game)
}
