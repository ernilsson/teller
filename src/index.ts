import express from "express";
import {story} from "./controller/rest/story"

require("dotenv").config()
import {DiscordIntegration} from "./controller/integration";
import {VoteCommand} from "./controller/commands/vote";
import {loadDiscordConfiguration} from "./controller/config";
import {StoryService} from "./service/story";
import { EventEmitter } from "events";
import {events} from "./controller/rest/events";

const app = async () => {
    const discord = new DiscordIntegration([new VoteCommand()])
    await discord.start(loadDiscordConfiguration())

    const emitter = new EventEmitter()

    const rest = express()
    rest.use('/', express.static('public'))
    rest.use(express.json())
    rest.use(events(emitter))
    rest.use(story(new StoryService(emitter)))
    rest.listen(process.env.PORT || 3000, () =>
        console.log(`Rest interface is listening on port ${process.env.PORT || 3000}`))
}

app().then(() => console.log("Teller has been started"))