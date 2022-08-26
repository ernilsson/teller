import {GameRegistry} from "../../engine";
import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {EngineError} from "../../engine/errors";
import {Command} from "./command";

export class VoteCommand implements Command {
    private static readonly NAME = "vote"
    private static readonly OPTION_PATH = "path"

    constructor(private registry: GameRegistry) {}

    build(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .addStringOption(o => o.setName(VoteCommand.OPTION_PATH)
                .setDescription("Identifier for the path you would like to continue down")
                .setRequired(true)
            )
            .setName(VoteCommand.NAME)
            .setDescription("Vote for which path to continue down")
    }

    accept(cmd: CommandInteraction): boolean {
        return cmd.commandName === VoteCommand.NAME
    }

    handle(cmd: CommandInteraction): Promise<void> {
        return new Promise(async (resolve) => {
            if (!this.registry.hasGame(cmd.channelId)) {
                await cmd.reply("Please start a game before voting")
                return
            }
            const game = this.registry.getGame(cmd.channelId!)
            const id = cmd.options.get(VoteCommand.OPTION_PATH)
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