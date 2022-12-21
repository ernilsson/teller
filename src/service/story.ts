import {Bus} from "./events";
import { EventEmitter } from "events";

export class StoryService {
    constructor(private emitter: EventEmitter) {
    }
    async create(story: any) {
        // TODO: Load story as playable
        this.emitter.emit('story.start', {
            action: "created"
        })
    }

    async start(channelId: string) {
        // TODO: start loaded story in the provided channel
        this.emitter.emit('story.start', {
            action: "start",
            channelId
        })
    }

    async step() {
        // TODO: close voting and step to next path
    }
}