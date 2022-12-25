import express, {Router} from "express"
import {StoryService} from "../../service/story";
import {Story} from "../../model/story";

export const story = (service: StoryService): Router => {
    const router = express.Router()

    router.post('/story', async (req, res) => {
        const body = req.body as Story
        service.create(body)
        res.status(200).end()
    })

    return router;
}