export interface Story {
    name: string
    description: string
    entryPoint: Path
}

export interface Path {
    prompt: string
    actions?: Action[]
}

export interface Action {
    description: string
    consequence: Path
}