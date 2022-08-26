import {EngineError, IllegalOperationError, InvalidArgumentError, InvalidStateError} from "./errors";

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

export interface Player {
    id: string
}

export interface DataSource {
    findPathById(id: number): Promise<Path>
    findInitialPathByGameId(id: number): Promise<Path>
}

export class Game {
    private path!: Path
    private voters: Set<string>

    constructor(
        private dataSource: DataSource,
        private gameMaster: Player
    ) {
        this.voters = new Set<string>()
    }

    async loadGame(gameId: number) {
        this.path = await this.dataSource.findInitialPathByGameId(gameId)
    }

    getCurrentPath(): Path {
        return this.path
    }

    async step(player: Player) {
        if (player.id !== this.gameMaster.id) {
            throw new IllegalOperationError("Only the game master can proceed the story")
        }
        const option = this.path.options.reduce((previous, current) =>
            previous.votes > current.votes ? previous : current)
        this.path = await this.dataSource.findPathById(option.nextPathId)
        this.voters.clear()
    }

    vote(id: string, player: Player) {
        if (this.voters.has(player.id)) {
            throw new IllegalOperationError("Player tried to vote more than once")
        }
        const option = this.path.options.find(o => o.id === id)
        if (!option) {
            throw new InvalidArgumentError("Player tried to vote for extraneous options")
        }
        option.votes++
        this.voters.add(player.id)
    }

    hasEnded(): boolean {
        return this.getCurrentPath().options.length === 0
    }
}

export class GameBuilder {
    private static readonly NO_GAME_ID = -1
    private static readonly NO_GAME_MASTER = { id: "" }
    private gameId: number
    private gameMaster: Player

    constructor(private dataSource: DataSource) {
        this.gameId = GameBuilder.NO_GAME_ID;
        this.gameMaster = GameBuilder.NO_GAME_MASTER
    }

    withGameId(id: number): GameBuilder {
        this.gameId = id
        return this
    }

    withGameMaster(player: Player): GameBuilder {
        this.gameMaster = player
        return this
    }

    async build(): Promise<Game> {
        if (this.gameId === GameBuilder.NO_GAME_ID) {
            throw new InvalidStateError("No game ID provided to builder")
        }
        if (this.gameMaster === GameBuilder.NO_GAME_MASTER) {
            throw new InvalidStateError("No game master ID provided to builder")
        }
        const engine = new Game(this.dataSource, this.gameMaster)
        await engine.loadGame(this.gameId)
        this.reset()
        return engine
    }

    private reset() {
        this.gameId = GameBuilder.NO_GAME_ID;
    }
}