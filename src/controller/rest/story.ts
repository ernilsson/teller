import express, {Router} from "express"
import {StoryService} from "../../service/story";

export const story = (service: StoryService): Router => {
    const router = express.Router()

    router.post('/story', async (req, res) => {
        const body = req.body
        await service.create(body)
        res.status(200).end()
    })

    return router;
}