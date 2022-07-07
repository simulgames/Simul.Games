package compare

import (
	"errors"
	"simul-app/games"
)

type MatchLevel int

const (
	NoLetter MatchLevel = iota
	HasLetter
	HasSameLetter
)

func IfValidWord(hiddenWord, guessWord string) ([]MatchLevel, error) {
	if !games.ValidWordsEnglish[guessWord] {
		return nil, errors.New("word is not valid")
	}
	return Compare(hiddenWord, guessWord)
}

func Compare(hiddenWord, guessWord string) ([]MatchLevel, error) {
	wordLength := len(hiddenWord)
	if wordLength != len(guessWord) {
		return nil, errors.New("words are not the same length")
	}

	matches := make([]MatchLevel, wordLength)
	leftOverLetters := make([]rune, wordLength)

	for i := 0; i < wordLength; i++ {
		currentLetter := hiddenWord[i]
		if currentLetter == guessWord[i] {
			matches[i] = HasSameLetter
		} else {
			leftOverLetters[i] = rune(currentLetter)
		}
	}

	for i := 0; i < wordLength; i++ {
		if matches[i] == HasSameLetter {
			continue
		}

		currentLetter := rune(guessWord[i])

		if removeLetterIfExists(currentLetter, leftOverLetters) {
			matches[i] = HasLetter
		} else {
			matches[i] = NoLetter
		}
	}

	return matches, nil
}

func removeLetterIfExists(letter rune, letters []rune) bool {
	for i := 0; i < len(letters); i++ {
		if letter == letters[i] {
			letters = append(letters[:i], letters[i+1:]...)
			return true
		}
	}
	return false
}

func IsPerfectMatch(matches []MatchLevel) bool {
	for match := range matches {
		if matches[match] != HasSameLetter {
			return false
		}
	}
	return true
}
