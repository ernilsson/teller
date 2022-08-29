import {GameRepository} from "../data/game";
import {PathRepository} from "../data/path";
import {OptionRepository} from "../data/option";

export class StoryService {
    constructor(
        private games: GameRepository,
        private paths: PathRepository,
        private options: OptionRepository,
    ) {
    }

    // TODO: Define an interface for the story type! -- Rasmus
    async create(story: any) {
        const id = await this.path(story.path)
        await this.games.insert({
            name: story.name,
            initialPathId: id,
        })
    }

    async path(path: any): Promise<number> {
        if (path.options.length === 0) {
            const pth = await this.paths.insert({description: path.description})
            return pth.id
        }
        const parent = await this.paths.insert({description: path.description})
        for (const option of path.options) {
            const id = await this.path(option.path)
            await this.options.insert({
                action: option.action,
                childPathId: id,
                parentPathId: parent.id,
            })
        }
        return parent.id
    }
}