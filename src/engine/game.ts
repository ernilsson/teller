import {EngineError} from "./errors";

export interface Path {
    description: string
    options: Option[]
}

export interface Option {
    id: string
    action: string
    nextPathId: number
    votes: number
}

export interface DataSource {
    findPathById(id: number): Promise<Path>
    findInitialPathByGameId(id: number): Promise<Path>
}

export class Game {
    private path!: Path
    private voters: string[]

    constructor(private dataSource: DataSource) {
        this.voters = []
    }

    async loadGame(gameId: number) {
        this.path = await this.dataSource.findInitialPathByGameId(gameId)
    }

    getCurrentPath(): Path {
        return this.path
    }

    async step() {
        const option = this.path.options.reduce((previous, current) =>
            previous.votes > current.votes ? previous : current)
        this.path = await this.dataSource.findPathById(option.nextPathId)
        this.voters = []
    }

    vote(id: string, player: string) {
        if (this.voters.includes(player)) {
            throw new EngineError("Player tried to vote more than once")
        }
        const option = this.path.options.find(o => o.id === id)
        if (!option) {
            throw new EngineError("Player tried to vote for extraneous options")
        }
        option.votes++
        this.voters.push(player)
    }

    hasEnded(): boolean {
        return this.getCurrentPath().options.length === 0
    }
}

export class GameBuilder {
    private static readonly NO_GAME_ID = -1
    private gameId: number

    constructor(private dataSource: DataSource) {
        this.gameId = GameBuilder.NO_GAME_ID;
    }

    withGameId(id: number): GameBuilder {
        this.gameId = id
        return this
    }

    async build(): Promise<Game> {
        if (this.gameId === GameBuilder.NO_GAME_ID) {
            throw new Error("No game ID provided to builder.")
        }
        const engine = new Game(this.dataSource)
        await engine.loadGame(this.gameId)
        this.reset()
        return engine
    }

    private reset() {
        this.gameId = GameBuilder.NO_GAME_ID;
    }
}