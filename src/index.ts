import {Game} from "./engine/game";
import {Path, createOption, createEndPath} from "./engine/path";
import {Engine} from "./engine/engine";

const path: Path = {
    description: "You are in a dark hole.",
    paths: [
        createOption({
            tag: "Dig deeper",
            path: createEndPath("You are now in an even darker hole.")
        }),
        createOption({
            tag: "Climb",
            path: createEndPath("You got out of the hole!")
        }),
    ]
}

const game: Game = {
    name: "The Hole",
    description: "You, the player, is stuck in a hole trying to survive.",
    initialPath: path,
}

const engine: Engine = new Engine(game)

console.log(engine.currentPath().description)

console.log("Voting once!")
engine.vote("Climb")

console.log("Voting twice!")
engine.vote("Climb")

console.log("Stepping to next path")
engine.step()

console.log(engine.currentPath().description)