import {Client, GatewayIntentBits, Routes, Interaction, SlashCommandBuilder} from "discord.js";
import {REST} from "@discordjs/rest"
import {CommandHandler, InteractionRouter} from "./router";

export const commands = [
    new SlashCommandBuilder()
        .setName("tell")
        .setDescription("Starts a new text adventure")
        .addIntegerOption(o => o.setName("id")
            .setDescription("The ID of the text adventure you want to start")
            .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Vote for which path to continue down")
        .addStringOption(o => o.setName("path")
            .setDescription("Identifier for the path you would like to continue down")
            .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName("step")
        .setDescription("Stop voting and step to the next path.")
].map(cmd => cmd.toJSON())

export interface DiscordConfiguration {
    token: string,
    clientId: string,
    guildId: string
}

export class DiscordIntegration {
    private readonly client: Client

    constructor(private router: InteractionRouter) {
        this.client = new Client({intents: [GatewayIntentBits.Guilds]})
        this.client.once('ready', () => {
            console.log("Discord client is ready!")
        })
    }

    async start(config: DiscordConfiguration) {
        this.upsertCommands(config)
        this.client.on('interactionCreate', async (interaction) => {
            try {
                await this.router.route(interaction)
            } catch (err) {
                console.error(err)
            }
        })
        await this.login(config.token)
    }

    private upsertCommands(config: DiscordConfiguration) {
        const rest = new REST({version: '10'}).setToken(config.token)
        rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {body: commands})
            .then(() => console.log("Registered commands."))
            .catch(console.error)
    }

    private async login(token: string) {
        if (!this.client) {
            throw new Error("Client was not initialised before calling login")
        }
        await this.client.login(token)
    }
}