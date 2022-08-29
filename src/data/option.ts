import {Option, OptionInsertPayload} from "./models/option"
import {Pool} from "mysql";

export abstract class OptionRepository {
    abstract findByParentId(id: number): Promise<Option[]>
    abstract insert(option: OptionInsertPayload): Promise<Option>
}