export type member = { name: string; color: string; id: string }
export type lobby = { "host-id": string; id: string; name: string }

export type LobbyData = {
    "client-id": string
    "has-started": boolean
    lobby: lobby
    members: [member]
}
