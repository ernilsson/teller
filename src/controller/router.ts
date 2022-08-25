import {Interaction} from "discord.js";
import {CommandHandler} from "./commands/command";

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
            if (handlers.length === 0) {
                await interaction.reply("Sorry, this action cannot be carried out right now!")
                return
            }
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