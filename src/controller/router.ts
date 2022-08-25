import {CommandInteraction, Interaction} from "discord.js";
import {GameRegistry, GameBuilder} from "../engine";
import {DiscordPathRenderer, PathRenderer} from "./renderer";
import {EngineError} from "../engine/errors";

export interface InteractionRouter {
    route(interaction: Interaction): Promise<void>
}

export class CommandInteractionRouter implements InteractionRouter {
    constructor(private handlers: CommandHandler[]) {
    }

    route(interaction: Interaction): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!interaction.isChatInputCommand()) {
                return;
            }
            const handlers = this.handlers.filter(h => h.accept(interaction))
            for (let handler of handlers) {
                try {
                    await handler.handle(interaction)
                } catch (err) {
                    reject(err)
                    return
                }
            }
            resolve()
        })
    }
}

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

    handle(cmd: CommandInteraction): Promise<void> {
        return new Promise<void>(async resolve => {
            const id = cmd.options.get("id")
            const game = await this.builder.withGameId(id?.value as number)
                .withGameMasterId(cmd.user.id)
                .build()
            this.registry.startGame(cmd.channelId, game)
            await cmd.reply(`**${cmd.user.tag}** has started a new game`)
            await cmd.channel!.send(this.renderer.render(game.getCurrentPath()))
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
               } else {
                   console.error(err)
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
            try {
                await game.step(cmd.user.id)
            } catch (err) {
                if (err instanceof EngineError) {
                    await cmd.reply(err.getMessage())
                } else {
                    console.error(err)
                }
                return
            }
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