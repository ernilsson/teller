import {Game, GameInsertPayload} from "./models/game"

export abstract class GameRepository {
    abstract findById(id: number): Promise<Game>
    abstract insert(game: GameInsertPayload): Promise<Game>
}