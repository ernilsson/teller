import express, {Router} from "express";
import {GameService} from "../../service/game";

export const game = (service: GameService): Router => {
    const router = express.Router()

    router.post('/game', (req, res) => {
        const channel = req.query.channel as string
        service.start(channel)
        res.status(200).end()
    })

    router.post('/step', (req, res) => {
        service.step()
        res.status(200).end()
    })

    return router;
}