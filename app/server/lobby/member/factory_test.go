package member

import (
	"fmt"
	"testing"
)

func TestReturnsErrorIfMemberNotValid(t *testing.T) {
	fac := NewFactory()
	_, err := fac.Make([]byte(nil))
	if err == nil {
		t.Fail()
	}
}

func TestMemberIsUnMarshalledCorrectly(t *testing.T) {
	fac := NewFactory()
	memberName := "hello, world!"
	memberTxt := fmt.Sprintf("{\"Name\":\"%s\"}", memberName)
	member, _ := fac.Make([]byte(memberTxt))
	if member.Name != memberName {
		t.Fail()
	}
}
