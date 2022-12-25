import {Client, GatewayIntentBits, TextChannel} from "discord.js";
import {CommandInteractionRouter, InteractionRouter} from "./router";
import {Command} from "./commands/command";
import {CommandRegistrar} from "./registrar";
import {DiscordConfiguration} from "./config";
import {EventEmitter} from "events";
import {DefaultPathRenderer, PathRenderer} from "./renderer";

export class DiscordIntegration {
    private readonly client: Client
    private readonly router: InteractionRouter
    private readonly registrar: CommandRegistrar
    private readonly renderer: PathRenderer

    constructor(private emitter: EventEmitter, commands: Command[]) {
        this.client = new Client({intents: [GatewayIntentBits.Guilds]})
        this.client.once('ready', () => {
            console.log("Discord client has reached 'ready' state")
        })
        this.router = new CommandInteractionRouter().registerCommandHandlers(commands)
        this.registrar = new CommandRegistrar(commands)
        this.renderer = new DefaultPathRenderer()
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
        this.emitter.on('game.started', async event => {
            const channel = (await this.client.channels.fetch(event.channel)) as TextChannel
            await channel.send("A new Teller game has been started on this channel!")
            await channel.send(this.renderer.render(event.path))
        })
        this.emitter.on('game.stepped', async event => {
            const channel = (await this.client.channels.fetch(event.channel)) as TextChannel
            await channel.send(this.renderer.render(event.path))
        })
        this.emitter.on('game.ended', async event => {
            const channel = (await this.client.channels.fetch(event.channel)) as TextChannel
            await channel.send(this.renderer.render(event.path))
            await channel.send("You have reached the end of this story, thank you for playing!")
        })
    }

    private async login(token: string) {
        if (!this.client) {
            throw new Error("Discord client was not initialised before calling login")
        }
        await this.client.login(token)
    }

    async getTextChannels(): Promise<{id: string, name: string}[]> {
        const channels = this.client.channels.valueOf().filter((channel) => channel.isTextBased())
        return (await Promise.all(channels.map(async ch => {
            const text = (await ch.fetch(true)) as TextChannel
            return {
                id: text.id as string,
                name: `${text.guild.name}: ${text.name}`
            }
        })))
    }
}