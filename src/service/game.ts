import {EventEmitter} from "events";
import {Engine} from "../core/engine";

export class GameService {

    constructor(private emitter: EventEmitter, private engine: Engine) {
    }

    start(channel: string) {
        this.engine.start(channel)
        const path = this.engine.path()
        this.emitter.emit('game.started', {
            channel,
            path,
        })
    }

    step() {
        this.engine.step()
        let type = 'game.stepped'
        if (!this.engine.ongoing()) {
            type = 'game.ended'
        }
        const channel = this.engine.channel()
        const path = this.engine.path()
        this.emitter.emit(type, {
            channel,
            path
        })
    }
}