import { EventEmitter } from "events";
import {Story} from "../model/story";
import {Engine} from "../core/engine";

export class StoryService {

    constructor(private emitter: EventEmitter, private engine: Engine) {}

    create(story: Story) {
        this.engine.load(story)
        this.emitter.emit('story.loaded')
    }
}