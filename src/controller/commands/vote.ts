import {GameRegistry} from "../../engine";
import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {Command} from "./command";
import {IllegalStateError} from "../errors";

export class VoteCommand implements Command {
    private static readonly NAME = "vote"
    private static readonly OPTION_PATH = "path"

    constructor(private registry: GameRegistry) {
    }

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

    async handle(cmd: CommandInteraction) {
        if (!this.registry.hasGame(cmd.channelId)) {
            throw new IllegalStateError("No game is running in this channel")
        }
        const game = this.registry.getGame(cmd.channelId!)
        const id = cmd.options.get(VoteCommand.OPTION_PATH)
        game.vote(id?.value as string, {id: cmd.user.id})
        await cmd.reply("Your vote has been counted.")
    }
}