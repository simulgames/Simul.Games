package header

type Header string

const (
	Empty              = ""
	Error              = "Error"
	InvalidSyntaxError = "InvalidSyntaxError"
	SessionID          = "SessionID"

	UserLocation = "UserLocation"

	JoinLobby            = "JoinLobby"
	LeaveLobby           = "LeaveLobby"
	MakeLobby            = "MakeLobby"
	GetLobbyDataInternal = "GetLobbyDataInternal"
	GetLobbyDataExternal = "GetLobbyDataExternal"

	LobbyFound    = "LobbyFound"
	LobbyJoined   = "LobbyJoined"
	LobbyLeft     = "LobbyLeft"
	LobbyData     = "LobbyData"
	LobbyNotFound = "LobbyNotFound"

	StartGame    = "StartGame"
	NewGame      = "NewGame"
	GameStarting = "GameStarting"
	MemberJoined = "MemberJoined"
	MemberLeft   = "MemberLeft"

	GameInfo            = "GameInfo"
	IsGameFinished      = "IsGameFinished"
	CompareResultClient = "CompareResultClient"
	CompareResultOther  = "CompareResultOther"
)
