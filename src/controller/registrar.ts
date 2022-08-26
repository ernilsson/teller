import {CommandBuilder} from "./commands/command";
import {REST} from "@discordjs/rest";
import {Routes} from "discord.js";
import {DiscordConfiguration} from "./config";

export class CommandRegistrar {
    constructor(private readonly builders: CommandBuilder[]) {
    }

    register(config: DiscordConfiguration) {
        const commands = this.builders.map(b => b.build()).map(c => c.toJSON())
        const rest = new REST({version: '10'}).setToken(config.token)
        rest.put(Routes.applicationCommands(config.clientId), {body: commands})
            .then(() => console.log("Registered commands."))
            .catch(console.error)
    }
}