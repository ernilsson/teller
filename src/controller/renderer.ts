import {Path} from "../engine";

export interface PathRenderer<T> {
    render(path: Path): T
}

export class DiscordPathRenderer implements PathRenderer<string> {
    render(path: Path): string {
        const options = path.options.map(o => `*${o.id}: ${o.action}*`).join("\n")
        return `**${path.description}**\n${options}`
    }
}