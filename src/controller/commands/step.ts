import {DiscordPathRenderer, PathRenderer} from "../renderer";
import {GameRegistry} from "../../engine";
import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {EngineError} from "../../engine/errors";
import {Command} from "./command";

export class StepCommand implements Command {
    private static readonly NAME = "step"

    private renderer: PathRenderer<string> = new DiscordPathRenderer()

    constructor(private registry: GameRegistry) {}

    build(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName(StepCommand.NAME)
            .setDescription("Close vote and proceed to the next path.")
    }

    accept(cmd: CommandInteraction): boolean {
        return cmd.commandName === StepCommand.NAME
    }

    handle(cmd: CommandInteraction): Promise<void> {
        return new Promise(async (resolve) => {
            if (!this.registry.hasGame(cmd.channelId)) {
                await cmd.reply("Please start a game first")
                return
            }
            const game = this.registry.getGame(cmd.channelId!)
            try {
                await game.step({ id: cmd.user.id })
            } catch (err) {
                if (err instanceof EngineError) {
                    await cmd.reply(err.getMessage())
                } else {
                    console.error(err)
                }
                return
            }
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