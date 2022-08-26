import {CommandInteraction, SlashCommandBuilder} from "discord.js";

export interface CommandHandler {
    accept(interaction: CommandInteraction): boolean
    handle(interaction: CommandInteraction): void
}

export interface CommandBuilder {
    build(): SlashCommandBuilder
}

export interface Command extends CommandHandler, CommandBuilder {}