import {CommandInteractionRouter} from "./controller/router";

require("dotenv").config()
import {MySQLGameRepository} from "./data/game-repository";
import {init, MySQLConfiguration} from "./data/mysql"
import {MySQLPathRepository} from "./data/path-repository";
import {MySQLOptionRepository} from "./data/option-repository";
import {DataSourceAdapter} from "./data/data-source-adapter";
import {GameBuilder, GameRegistry} from "./engine";
import {DiscordIntegration} from "./controller/integration";
import {TellCommand} from "./controller/commands/tell";
import {VoteCommand} from "./controller/commands/vote";
import {StepCommand} from "./controller/commands/step";
import {DiscordConfiguration} from "./controller/config";

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