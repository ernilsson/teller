import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {Command} from "./command";
import {Engine} from "../../core/engine";
import {EngineError} from "../../core/errors";

export class VoteCommand implements Command {
    private static readonly NAME = "vote"
    private static readonly OPTION_PATH = "path"

    constructor(private engine: Engine) {
    }

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
        const id = cmd.options.get(VoteCommand.OPTION_PATH)?.value as string
        const channel = cmd.channelId as string
        const user = cmd.user.id as string
        try {
            this.engine.vote(channel, user, id)
        } catch (err) {
            const e = err as EngineError
            await cmd.reply(e.message)
        }
        await cmd.reply("Your vote has been counted.")
    }
}