import {DiscordPathRenderer, PathRenderer} from "../renderer";
import {GameBuilder, GameRegistry} from "../../engine";
import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {Command} from "./command";

export class TellCommand implements Command {
    private static readonly NAME = "tell"
    private static readonly OPTION_ID = "id"

    private renderer: PathRenderer<string> = new DiscordPathRenderer()

    constructor(
        private registry: GameRegistry,
        private builder: GameBuilder
    ) {}

    build(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .addIntegerOption(o => o.setName(TellCommand.OPTION_ID)
                .setDescription("The ID of the text adventure you want to start")
                .setRequired(true)
            )
            .setName(TellCommand.NAME)
            .setDescription("Starts a new text adventure")
    }

    accept(cmd: CommandInteraction): boolean {
        return cmd.commandName === TellCommand.NAME
    }

    handle(cmd: CommandInteraction): Promise<void> {
        return new Promise<void>(async resolve => {
            const id = cmd.options.get(TellCommand.OPTION_ID)
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