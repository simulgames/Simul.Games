package ID

import "testing"

func TestID(t *testing.T) {
	iD := "hello, world!"
	id := ID{iD}
	if id.ID() != iD {
		t.Fail()
	}
}
