import { Game } from "./game";
import { Path } from "./path";

export class Engine {
    private path: Path

    constructor(private game: Game) {
        this.path = game.initialPath
    }

    vote(id: string) {
        if (this.hasEnded()) {
            throw new Error("Cannot vote on a game that has ended!")
        }
        const option = this.path.paths.find(p => p.tag === id)
        if (option) {
            option.votes++
        }
    }

    step() {
        if (this.hasEnded()) {
            throw new Error("Cannot continue a game that has ended!")
        }
        this.path = this.findNextPath()
    }

    private findNextPath(): Path {
        const nextPath = this.path.paths.reduce(
            (previous, current) =>
                previous.votes > current.votes ? previous : current
        )
        return nextPath.path
    }

    hasEnded(): boolean {
        return this.path.paths.length === 0
    }

    currentPath(): Path {
        return this.path
    }
}