import {Pool} from "mysql";
import {Game, GameInsertPayload} from "../models/game";
import {GameRepository} from "../game";

export class MySQLGameRepository extends GameRepository {
    constructor(private pool: Pool) {
        super();
    }

    findById(id: number): Promise<Game> {
        return new Promise<Game>((resolve, reject) => {
            this.pool.query("SELECT * FROM teller.game WHERE id = ?", id, (err, result) => {
                if (err) {
                    reject(err)
                    return
                }
                if (result.length === 0) {
                    reject(new Error(`No game found for ID ${id}`))
                    return
                }
                resolve({
                    id: result[0].id,
                    name: result[0].name,
                    initialPathId: result[0].initial_path_id
                })
            })
        })
    }

    insert(game: GameInsertPayload): Promise<Game> {
        return new Promise<Game>((resolve, reject) => {
            const parameters = [game.name, game.initialPathId]
            this.pool.query("INSERT INTO teller.game (name, initial_path_id) VALUES (?, ?)", parameters, (err, result) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve({
                    ...game,
                    id: result.insertId,
                })
            })
        })
    }
}