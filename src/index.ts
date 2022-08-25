require("dotenv").config()
import {MySQLGameRepository} from "./data/game-repository";
import {init} from "./data/mysql"
import {MySQLPathRepository} from "./data/path-repository";
import {MySQLOptionRepository} from "./data/option-repository";
import {DataSourceAdapter} from "./data/data-source-adapter";
import {GameBuilder, GameRegistry} from "./engine";
import {DiscordIntegration} from "./controller/integration";
import {
    CommandInteractionRouter,
    StepCommandHandler,
    TellCommandHandler,
    VoteCommandHandler
} from "./controller/router";

const app = async () => {
    const pool = init()
    const datasource = new DataSourceAdapter(
        new MySQLGameRepository(pool),
        new MySQLPathRepository(pool),
        new MySQLOptionRepository(pool),
    )

    const builder = new GameBuilder(datasource)
    const registry = new GameRegistry()
    const controller = new DiscordIntegration(new CommandInteractionRouter([
            new TellCommandHandler(registry, builder),
            new VoteCommandHandler(registry),
            new StepCommandHandler(registry)
        ]))

    await controller.start({
        token: process.env.DISCORD_TOKEN!,
        clientId: process.env.CLIENT_ID!,
        guildId: process.env.GUILD_ID!,
    })
}

app().then(() => console.log("Teller has been started"))