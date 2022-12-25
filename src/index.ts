import express from "express";
import {story} from "./controller/rest/story"

require("dotenv").config()
import {DiscordIntegration} from "./controller/integration";
import {VoteCommand} from "./controller/commands/vote";
import {loadDiscordConfiguration} from "./controller/config";
import {StoryService} from "./service/story";
import { EventEmitter } from "events";
import {events} from "./controller/rest/events";
import {Engine} from "./core/engine";
import {game} from "./controller/rest/game";
import {GameService} from "./service/game";
import {channels} from "./controller/rest/channels";

const app = async () => {
    const emitter = new EventEmitter()
    const engine = new Engine()

    const discord = new DiscordIntegration(emitter, [new VoteCommand(engine)])
    await discord.start(loadDiscordConfiguration())

    const rest = express()
    rest.use('/', express.static('public'))
    rest.use(express.json())
    rest.use(events(emitter))
    rest.use(story(new StoryService(emitter, engine)))
    rest.use(game(new GameService(emitter, engine)))
    rest.use(channels(discord))

    rest.listen(process.env.PORT || 3000, () =>
        console.log(`Rest interface is listening on port ${process.env.PORT || 3000}`))
}

app().then(() => console.log("Teller has been started"))