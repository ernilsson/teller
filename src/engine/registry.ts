import {Game} from "./game";

export class GameRegistry {
    private map: Map<string, Game>

    constructor() {
        this.map = new Map<string, Game>()
    }

    hasGame(channelId: string): boolean {
        return this.map.has(channelId)
    }

    endGame(channelId: string) {
        this.map.delete(channelId)
    }

    startGame(channelId: string, engine: Game) {
        this.map.set(channelId, engine)
    }

    getGame(channelId: string): Game {
        return this.map.get(channelId)!
    }
}