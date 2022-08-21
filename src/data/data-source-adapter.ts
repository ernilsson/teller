import {PathRepository} from "./path-repository";
import {OptionRepository} from "./option-repository";
import * as engine from "../engine";

export class DataSourceAdapter implements engine.EngineDataSource {
    constructor(
        private pathRepository: PathRepository,
        private optionRepository: OptionRepository
    ) {
    }

    async findPathById(id: number): Promise<engine.Path> {
        const path = await this.pathRepository.findById(id)
        const options = await this.optionRepository.findByParentId(path.id)
        return {
            description: path.description,
            options: options.map((o, index) => ({
                id: String.fromCharCode(65 + index),
                action: o.action,
                nextPathId: o.childPathId,
                votes: 0,
            }))
        }
    }
}