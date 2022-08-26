import {Option} from "../models/option"
import {Pool} from "mysql";

export abstract class OptionRepository {
    abstract findByParentId(id: number): Promise<Option[]>
}