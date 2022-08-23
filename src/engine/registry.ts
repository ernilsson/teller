import {Game} from "./index";

export class GameRegistry {
    private map: Map<string, Game>

    constructor() {
        this.map = new Map<string, Game>()
    }

    isGameOngoing(channelId: string): boolean {
        return this.map.has(channelId)
    }

    endGame(channelId: string) {
        this.map.delete(channelId)
    }

    startGame(channelId: string, engine: Game) {
        if (this.isGameOngoing(channelId)) {
            throw new Error("Cannot overwrite ongoing game.")
        }
        this.map.set(channelId, engine)
    }

    getGame(channelId: string): Game {
        return this.map.get(channelId)!
    }
}