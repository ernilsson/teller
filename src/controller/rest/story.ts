import express, {Router} from "express"
import {StoryService} from "../../service/story";

export const storyRouter = (srv: StoryService): Router => {
    const router = express.Router()

    router.post('/story', async (req, res) => {
        const body = req.body
        await srv.create(body)
        res.status(200).end()
    })

    return router;
}