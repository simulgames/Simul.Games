package games

import (
	"encoding/json"
	"log"
	"os"
)

type validWordDictionary map[string]bool
type wordPool map[int][]string

type wordDictionary struct {
	English []string
}

func (v validWordDictionary) UnmarshalJSON(bytes []byte) error {
	wordSlices := wordDictionary{}
	unMarshalErr := json.Unmarshal(bytes, &wordSlices)
	for _, word := range (wordSlices).English {
		v[word] = true
	}
	return unMarshalErr
}

var ValidWordsEnglish = make(validWordDictionary)
var WordPoolEnglish = make(wordPool)

func Setup() {
	unmarshalFileToDictionary("../dictionary/en/all.json", &ValidWordsEnglish)
	unmarshalFileToDictionary("../dictionary/en/common.json", &WordPoolEnglish)
}

func unmarshalFileToDictionary(file string, dictionary any) {
	validWordsJson, readErr := os.ReadFile(file)
	if readErr != nil {
		log.Fatal(readErr, "cannot read dictionary!")
	}
	unMarshalErr := json.Unmarshal(validWordsJson, dictionary)
	if unMarshalErr != nil {
		log.Fatal(unMarshalErr, "cannot unmarshal dictionary!")
	}
}
