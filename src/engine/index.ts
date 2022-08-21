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

export interface EngineDataSource {
    findPathById(id: number): Promise<Path>
}

export class Engine {
    private path!: Path

    constructor(private dataSource: EngineDataSource) {}

    async loadPath(id: number) {
        this.path = await this.dataSource.findPathById(id)
    }

    getCurrentPath(): Path {
        return this.path
    }

    async step() {
        const option = this.path.options.reduce((previous, current) =>
            previous.votes > current.votes ? previous : current)
        this.path = await this.dataSource.findPathById(option.nextPathId)
    }

    vote(id: string) {
        const option = this.path.options.find(o => o.id === id)
        if (!option) {
            throw new Error(`No option found of ID ${id}`)
        }
        option.votes++
    }
}

export class EngineBuilder {
    private dataSource!: EngineDataSource
    private initialPathId!: number

    withDataSource(dataSource: EngineDataSource): EngineBuilder {
        this.dataSource = dataSource
        return this
    }

    withInitialPathId(id: number): EngineBuilder {
        this.initialPathId = id
        return this
    }

    async build(): Promise<Engine> {
        const engine = new Engine(this.dataSource)
        await engine.loadPath(this.initialPathId)
        return engine
    }
}