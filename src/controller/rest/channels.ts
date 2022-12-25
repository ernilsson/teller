import express, {Router} from "express";
import {DiscordIntegration} from "../integration";

export const channels = (integration: DiscordIntegration): Router => {
    const router = express.Router()

    router.get('/channels', async (req, res) => {
        const channels = await integration.getTextChannels()
        res.status(200).send(channels)
    })

    return router;
}