import {Game} from "../models/game"

export abstract class GameRepository {
    abstract findById(id: number): Promise<Game>
}