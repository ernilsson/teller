import * as mysql from "./data/mysql"
import {MySQLGameRepository} from "./data/game-repository";
import {MySQLPathRepository} from "./data/path-repository";
import {MySQLOptionRepository} from "./data/option-repository";
import {EngineBuilder} from "./engine";
import {DataSourceAdapter} from "./data/data-source-adapter";
import * as readline from "readline"

const app = async () => {
    const pool = mysql.init()
    const repo = new MySQLGameRepository(pool)
    const game = await repo.findById(1)
    const adapter = new DataSourceAdapter(
        new MySQLPathRepository(pool),
        new MySQLOptionRepository(pool),
    )
    const engine = await new EngineBuilder()
        .withInitialPathId(game.initialPathId)
        .withDataSource(adapter)
        .build()
    while (engine.getCurrentPath().options.length > 0) {
        console.log(engine.getCurrentPath().description)
        engine.getCurrentPath().options.forEach(o => {
            console.log(`${o.id}: ${o.action}`)
        })
        const next = await requestInput(">>")
        engine.vote(next)
        await engine.step()
    }
    console.log(engine.getCurrentPath().description)
    pool.end()
}

const requestInput = (prompt: string): Promise<string> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    return new Promise(resolve => rl.question(prompt, ans => {
        rl.close()
        resolve(ans)
    }))
}

app().then(() => console.log("Exited program"))