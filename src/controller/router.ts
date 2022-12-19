import {CommandInteraction, Interaction} from "discord.js";
import {CommandHandler} from "./commands/command";
import {ApiError, InvalidCommandError} from "./errors";

export interface InteractionRouter {
    route(interaction: Interaction): void
}

export class CommandInteractionRouter implements InteractionRouter {
    private readonly errorHandlers: ErrorHandler[] = []
    private readonly handlers: CommandHandler[] = []

    constructor() {
        this.registerErrorHandlers([
            new ApiErrorHandler(),
        ])
    }

    registerErrorHandlers(handlers: ErrorHandler[]): CommandInteractionRouter {
        handlers.forEach(handler => this.registerErrorHandler(handler))
        return this
    }

    registerErrorHandler(errorHandler: ErrorHandler) {
        this.errorHandlers.push(errorHandler)
        console.log(`Registered error handler: ${errorHandler.constructor.name}`)
    }

    registerCommandHandlers(handlers: CommandHandler[]): CommandInteractionRouter {
        handlers.forEach(handler => this.registerCommandHandler(handler))
        return this
    }

    registerCommandHandler(commandHandler: CommandHandler) {
        this.handlers.push(commandHandler)
        console.log(`Registered command handler: ${commandHandler.constructor.name}`)
    }

    async route(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) {
            return;
        }
        const command = interaction as CommandInteraction
        const handlers = this.handlers.filter(h => h.accept(command))
        try {
            if (handlers.length === 0) {
                throw new InvalidCommandError(`Failed to find a handler for command: ${command.commandName}`)
            }
            for (const handler of handlers) {
                await handler.handle(command)
            }
        } catch (err) {
            await this.handle(interaction, err)
        }
    }

    async handle(interaction: Interaction, err: any) {
        const handlers = this.errorHandlers.filter(handler => handler.accept(err))
        for (const h of handlers) {
            await h.handle(interaction, err);
        }
    }
}

export interface ErrorHandler {
    accept(err: any): boolean
    handle(interaction: Interaction, err: any): void
}

class ApiErrorHandler implements ErrorHandler {
    accept(err: any): boolean {
        return err instanceof ApiError
    }

    async handle(interaction: Interaction, err: any) {
        if (interaction.isRepliable()) {
            await interaction.reply((err as ApiError).message)
        }
    }
}