import {Pool} from "mysql";
import {Option, OptionInsertPayload} from "../models/option";
import {OptionRepository} from "../option";

interface OptionEntity {
    id: number
    action: string
    parent_path_id: number
    child_path_id: number
}

export class MySQLOptionRepository extends OptionRepository {
    constructor(private pool: Pool) {
        super()
    }

    findByParentId(id: number): Promise<Option[]> {
        return new Promise((resolve, reject) => {
            this.pool.query("SELECT * FROM teller.option WHERE parent_path_id = ? LIMIT 10", id, (err, result) => {
                if (err) reject(err)
                resolve(result.map((r: OptionEntity) => {
                    return {
                        id: r.id,
                        action: r.action,
                        parentPathId: r.parent_path_id,
                        childPathId: r.child_path_id
                    }
                }))
            })
        });
    }

    insert(option: OptionInsertPayload): Promise<Option> {
        return new Promise((resolve, reject) => {
            const parameters = [option.action, option.parentPathId, option.childPathId]
            this.pool.query("INSERT INTO teller.option (action, parent_path_id, child_path_id) VALUES (?, ?, ?)", parameters, (err, result) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve({
                    ...option,
                    id: result.insertId
                })
            })
        })
    }
}