import {InternalPath} from "../core/engine";

export interface PathRenderer {
    render(path: InternalPath): string
}

export class DefaultPathRenderer implements PathRenderer {
    render(path: InternalPath): string {
        let prompt = `${path.prompt}\n\n`
        if (path.actions) {
            const actions = path.actions!.map(action => `**${action.id}**. ${action.description}`).join('\n')
            prompt += `${actions}\n`
        }
        return prompt
    }
}