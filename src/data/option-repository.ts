import {Option} from "../models/option"
import {Pool} from "mysql";

export abstract class OptionRepository {
    abstract findByParentId(id: number): Promise<Option[]>
}

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
}