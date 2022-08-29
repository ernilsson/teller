export interface Game {
    id: number
    name: string
    initialPathId: number
}

export interface GameInsertPayload {
    name: string
    initialPathId: number
}
