export class EngineError {
    constructor(private message: string) {
    }

    getMessage(): string {
        return this.message
    }
}