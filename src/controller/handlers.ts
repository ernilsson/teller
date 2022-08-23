import {CommandInteraction} from "discord.js";
import {GameRegistry, GameBuilder} from "../engine";
import {DiscordPathRenderer, PathRenderer} from "./renderer";
import {EngineError} from "../engine/errors";


export interface CommandHandler {
    accept(interaction: CommandInteraction): boolean
    handle(interaction: CommandInteraction): Promise<void>
}

export class TellCommandHandler implements CommandHandler {
    private renderer: PathRenderer<string> = new DiscordPathRenderer()

    constructor(
        private registry: GameRegistry,
        private builder: GameBuilder
    ) {}

    accept(cmd: CommandInteraction): boolean {
        if (cmd.commandName !== "tell") {
            return false
        }
        return !this.registry.isGameOngoing(cmd.channelId);
    }

    handle(interaction: CommandInteraction): Promise<void> {
        return new Promise<void>(async resolve => {
            const id = interaction.options.get("id")
            const game = await this.builder.withGameId(id?.value as number).build()
            this.registry.startGame(interaction.channelId, game)
            await interaction.reply("Starting game!")
            await interaction.channel!.send(this.renderer.render(game.getCurrentPath()))
            resolve()
        })
    }
}

export class VoteCommandHandler implements CommandHandler {

    constructor(private registry: GameRegistry) {}

    accept(cmd: CommandInteraction): boolean {
        if (cmd.commandName !== "vote") {
            return false
        }
        return this.registry.isGameOngoing(cmd.channelId)
    }

    handle(cmd: CommandInteraction): Promise<void> {
        return new Promise(async (resolve) => {
            const game = this.registry.getGame(cmd.channelId!)
            const id = cmd.options.get("path")
            try {
                game.vote(id?.value as string, cmd.user.id)
                await cmd.reply("Your vote has been counted.")
            } catch (err) {
               if (err instanceof EngineError) {
                   await cmd.reply(err.getMessage())
               }
            }
            resolve()
        })
    }
}

export class StepCommandHandler implements CommandHandler {
    private renderer: PathRenderer<string> = new DiscordPathRenderer()

    constructor(private registry: GameRegistry) {}

    accept(cmd: CommandInteraction): boolean {
        return cmd.commandName === "step" && this.registry.isGameOngoing(cmd.channelId)
    }

    handle(cmd: CommandInteraction): Promise<void> {
        return new Promise(async (resolve) => {
            const game = this.registry.getGame(cmd.channelId!)
            await game.step()
            // TODO: err handling
            await cmd.reply("Voting has been closed")
            await cmd.channel!.send(this.renderer.render(game.getCurrentPath()))
            if (game.hasEnded()) {
                await cmd.channel!.send("You have reached the end of the game.\nThank you for playing!")
                this.registry.endGame(cmd.channelId)
            }
            resolve()
        })
    }
}