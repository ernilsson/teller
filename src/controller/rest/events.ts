import express, {Router} from "express";
import { EventEmitter } from "events";
import * as crypto from "crypto";

export const events = (emitter: EventEmitter): Router => {
    const router = express.Router()

    const serverSideEvent = (data: string): string => {
        const id = crypto.createHash('md5').update(data).digest('hex')
        return `id: ${id}\ndata: ${data}\n\n`
    }

    router.get('/events', async (req, res) => {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        })
        emitter.on('story.loaded', () => {
            res.write(serverSideEvent(JSON.stringify({
                type: 'story.loaded',
            })))
        })
        emitter.on('game.started', (event) => {
            res.write(serverSideEvent(JSON.stringify({
                type: 'game.started',
                ...event
            })))
        })
    })

    return router;
}