export interface DiscordConfiguration {
    token: string,
    clientId: string
}

export const loadDiscordConfiguration = () => {
    return {
        token: process.env.DISCORD_TOKEN!,
        clientId: process.env.CLIENT_ID!,
    }
}