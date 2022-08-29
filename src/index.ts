import express from "express";
import {storyRouter} from "./controller/rest/story"

require("dotenv").config()
import {MySQLGameRepository} from "./data/mysql/game";
import {init, MySQLConfiguration} from "./data/mysql/pool"
import {MySQLPathRepository} from "./data/mysql/path";
import {MySQLOptionRepository} from "./data/mysql/option";
import {DataSourceAdapter} from "./data/mysql/data-source-adapter";
import {GameBuilder, GameRegistry} from "./engine";
import {DiscordIntegration} from "./controller/integration";
import {TellCommand} from "./controller/commands/tell";
import {VoteCommand} from "./controller/commands/vote";
import {StepCommand} from "./controller/commands/step";
import {DiscordConfiguration} from "./controller/config";
import {StoryService} from "./service/story";

const app = async () => {
    const pool = init(getMysqlConfig())
    const datasource = new DataSourceAdapter(
        new MySQLGameRepository(pool),
        new MySQLPathRepository(pool),
        new MySQLOptionRepository(pool),
    )

    const builder = new GameBuilder(datasource)
    const registry = new GameRegistry()
    const controller = new DiscordIntegration([
            new TellCommand(registry, builder),
            new VoteCommand(registry),
            new StepCommand(registry)
        ])

    await controller.start(getDiscordConfig())

    const rest = express()
    rest.use(express.json())
    rest.use(storyRouter(new StoryService(
        new MySQLGameRepository(pool),
        new MySQLPathRepository(pool),
        new MySQLOptionRepository(pool),
    )))
    rest.listen(process.env.PORT || 3000, () =>
        console.log(`Rest interface is listening on port ${process.env.PORT || 3000}`))
}

const getMysqlConfig = (): MySQLConfiguration => {
    return {
        host: process.env.MYSQL_HOST!,
        user: process.env.MYSQL_USER!,
        password: process.env.MYSQL_PASSWORD!
    }
}

const getDiscordConfig = (): DiscordConfiguration => {
    return {
        token: process.env.DISCORD_TOKEN!,
        clientId: process.env.CLIENT_ID!,
    }
}

app().then(() => console.log("Teller has been started"))