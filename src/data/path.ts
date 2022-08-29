import {Path, PathInsertPayload} from "./models/path"

export abstract class PathRepository {
    abstract findById(id: number): Promise<Path>
    abstract insert(path: PathInsertPayload): Promise<Path>
}