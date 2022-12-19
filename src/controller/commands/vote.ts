import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {Command} from "./command";

export class VoteCommand implements Command {
    private static readonly NAME = "vote"
    private static readonly OPTION_PATH = "path"

    build(): SlashCommandBuilder {
        const builder = new SlashCommandBuilder()
        builder.addStringOption(o => o.setName(VoteCommand.OPTION_PATH)
            .setDescription("Identifier for the path you would like to continue down")
            .setRequired(true)
        )
        builder.setName(VoteCommand.NAME)
        builder.setDescription("Vote for which path to continue down")
        return builder
    }

    accept(cmd: CommandInteraction): boolean {
        return cmd.commandName === VoteCommand.NAME
    }

    async handle(cmd: CommandInteraction) {
        // TODO: Verify that there is an ongoing game in channel
        const id = cmd.options.get(VoteCommand.OPTION_PATH)
        // TODO: Use action ID to cast vote in ongoing game
        await cmd.reply("Your vote has been counted.")
    }
}