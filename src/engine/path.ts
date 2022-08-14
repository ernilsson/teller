import * as crypto from 'crypto'

export interface Path {
    description: string
    paths: Option[]
}

export const createEndPath = (description: string): Path => {
    return {
        description,
        paths: []
    }
}

export interface Option {
    id: string
    votes: number
    tag: string
    path: Path
}

interface OptionParams {
    tag: string
    path: Path
}

export const createOption = (params: OptionParams): Option => {
    const id = crypto.createHash('md5').update(params.tag).digest('hex')
    return {
        id,
        votes: 0,
        ...params
    }
}