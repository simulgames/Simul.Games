package compare

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestSameWord(t *testing.T) {
	matchLevel, _ := Compare("hello", "hello")
	assert.Equal(t, []MatchLevel{HasSameLetter, HasSameLetter, HasSameLetter, HasSameLetter, HasSameLetter}, matchLevel)
}

func TestSimilarWord(t *testing.T) {
	matchLevel, _ := Compare("hello", "world")
	assert.Equal(t, []MatchLevel{NoLetter, HasLetter, NoLetter, HasSameLetter, NoLetter}, matchLevel)
}

func TestSimilarWordOpposite(t *testing.T) {
	matchLevel, _ := Compare("world", "hello")
	assert.Equal(t, []MatchLevel{NoLetter, NoLetter, NoLetter, HasSameLetter, HasLetter}, matchLevel)
}

func TestNotSameSize(t *testing.T) {
	_, err := Compare("hello", "Simul-Server")
	if err.Error() != "words are not the same length" {
		t.Fail()
	}
}
