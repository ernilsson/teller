import {Pool} from "mysql";
import {Path, PathInsertPayload} from "../models/path";
import {PathRepository} from "../path";

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

    insert(path: PathInsertPayload): Promise<Path> {
        return new Promise<Path>((resolve, reject) => {
            this.pool.query("INSERT INTO teller.path (description) VALUES (?)", path.description, (err, result) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve({
                    ...path,
                    id: result.insertId,
                })
            })
        })
    }
}