import {Action, Path, Story} from "../model/story";
import {DuplicateVoteError, EngineError} from "./errors";

export interface Configuration {
    story?: Story
    channel?: string
}

export class Engine {
    private configuration: Configuration = {}

    private game?: Game

    load(story: Story) {
        if (this.ongoing()) {
            throw new EngineError("Cannot load story while a game is ongoing")
        }
        this.configuration.story = story
    }

    start(channel: string) {
        if (!this.configuration.story) {
            throw new EngineError("Must load a story before starting game")
        }
        this.configuration.channel = channel
        this.game = new Game(this.configuration.story!.entryPoint)
    }

    path(): InternalPath {
        if (!this.game) {
            throw new EngineError("Must start game before executing game functions")
        }
        return this.game.getPath()
    }

    step() {
        if (!this.game || this.game.ended()) {
            throw new EngineError("No game is running")
        }
        this.game!.step()
    }

    vote(channel: string, voter: string, vote: string) {
        if (!this.game || this.game.ended()) {
            throw new EngineError("No game is running")
        }
        if (channel !== this.configuration.channel) {
            throw new EngineError("No game is running on this channel")
        }
        this.game!.vote(voter, vote)
    }

    channel(): string {
        return this.configuration!.channel!
    }

    ongoing(): boolean {
        return !!this.game && !this.game.ended()
    }
}

export class Game {
    private path: InternalPath

    constructor(entryPoint: Path) {
        this.path = pathToInternal(entryPoint)
    }

    getPath() {
        return this.path
    }

    vote(voter: string, vote: string) {
        if (this.ended()) {
            throw new EngineError("Game has already ended")
        }
        const voted = this.path.actions!.some(action => action.voters.includes(voter))
        if (voted) {
            throw new DuplicateVoteError()
        }
        const action = this.path.actions!.find(action => action.id === vote)
        if (!action) {
            throw new EngineError("Tried to vote for non-existent action")
        }
        action.voters.push(voter)
    }

    step() {
        const action = this.path.actions!.reduce((previous, current) =>
            previous.voters.length > current.voters.length ? previous : current)
        this.path = pathToInternal(action.consequence)
    }

    ended(): boolean {
        return !this.path.actions || this.path.actions.length === 0
    }
}

export interface InternalPath {
    prompt: string
    actions?: InternalAction[]
}

const pathToInternal = (path: Path): InternalPath => {
    return {
        prompt: path.prompt,
        actions: path.actions?.map((action, index) => actionToInternal(index, action))
    }
}

export interface InternalAction {
    id: string
    description: string
    voters: string[]
    consequence: Path
}

const actionToInternal = (index: number, action: Action): InternalAction => {
    return {
        ...action,
        id: String.fromCharCode(65 + index),
        voters: []
    }
}