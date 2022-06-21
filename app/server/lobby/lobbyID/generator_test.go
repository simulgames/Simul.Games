package lobbyID

import (
	"fmt"
	"log"
	"testing"
)

func TestGeneratedIsAlwaysSixDigitID(t *testing.T) {
	max := fmt.Sprint(maxCodeExclusive - 1)
	min := fmt.Sprint(minCodeInclusive)
	if !isSixDigits(max) {
		t.Fail()
		log.Println(max)
	}
	if !isSixDigits(min) {
		t.Fail()
		log.Println(min)
	}
	for i := 0; i < 5000; i++ {
		uniqueID := NewGenerator().Generate()
		if !isSixDigits(uniqueID) {
			log.Println(uniqueID)
			t.Fail()
		}
	}
}

func isSixDigits(i string) bool {
	return len([]rune(i)) == 6
}
