import {Path} from "../models/path"
import {Pool} from "mysql";

export abstract class PathRepository {
    abstract findById(id: number): Promise<Path>
}

export class MySQLPathRepository extends PathRepository {
    constructor(private pool: Pool) {
        super();
    }

    findById(id: number): Promise<Path> {
        return new Promise((resolve, reject) => {
            this.pool.query("SELECT * FROM teller.path WHERE id = ?", id, (err, result) => {
                if (err) reject(err)
                if (result.length === 0) {
                    reject(new Error(`No path for ID ${id}`))
                }
                resolve({
                    id: result[0].id,
                    description: result[0].description,
                })
            })
        })
    }
}