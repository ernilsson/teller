import {Client, GatewayIntentBits} from "discord.js";
import {CommandInteractionRouter, InteractionRouter} from "./router";
import {Command} from "./commands/command";
import {CommandRegistrar} from "./registrar";
import {DiscordConfiguration} from "./config";

export class DiscordIntegration {
    private readonly client: Client
    private readonly router: InteractionRouter
    private readonly registrar: CommandRegistrar

    constructor(commands: Command[]) {
        this.client = new Client({intents: [GatewayIntentBits.Guilds]})
        this.client.once('ready', () => {
            console.log("Discord client has reached 'ready' state")
        })
        this.router = new CommandInteractionRouter(commands)
        this.registrar = new CommandRegistrar(commands)
    }

    async start(config: DiscordConfiguration) {
        this.registrar.register(config)
        this.client.on('interactionCreate', async (interaction) => {
            try {
                await this.router.route(interaction)
            } catch (err) {
                console.error(err)
            }
        })
        await this.login(config.token)
    }

    private async login(token: string) {
        if (!this.client) {
            throw new Error("Discord client was not initialised before calling login")
        }
        await this.client.login(token)
    }
}