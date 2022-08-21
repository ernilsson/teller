import {Pool} from "mysql";
import {Game} from "../models/game"

export abstract class GameRepository {
    abstract findById(id: number): Promise<Game>
}

export class MySQLGameRepository extends GameRepository {
    constructor(private pool: Pool) {
        super();
    }

    findById(id: number): Promise<Game> {
        return new Promise<Game>((resolve, reject) => {
            this.pool.query("SELECT * FROM teller.game WHERE id = ?", id, (err, result) => {
                if (err) reject(err)
                if (result.length === 0) {
                    reject(new Error(`No game found for ID ${id}`))
                }
                resolve({
                    id: result[0].id,
                    name: result[0].name,
                    initialPathId: result[0].initial_path_id
                })
            })
        })
    }
}