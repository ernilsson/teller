export interface Option {
    id: number
    action: string
    parentPathId: number
    childPathId: number
}

export interface OptionInsertPayload {
    action: string
    parentPathId: number
    childPathId: number
}