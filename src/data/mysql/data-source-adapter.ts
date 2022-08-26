import {PathRepository} from "../path";
import {OptionRepository} from "../option";
import * as engine from "../../engine";
import {GameRepository} from "../game";

export class DataSourceAdapter implements engine.DataSource {
    constructor(
        private gameRepository: GameRepository,
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

    async findInitialPathByGameId(id: number): Promise<engine.Path> {
        const game = await this.gameRepository.findById(id)
        return this.findPathById(game.initialPathId)
    }
}