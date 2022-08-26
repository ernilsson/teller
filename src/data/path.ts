import {Path} from "../models/path"
import {Pool} from "mysql";

export abstract class PathRepository {
    abstract findById(id: number): Promise<Path>
}