export class EngineError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

export class DuplicateVoteError extends EngineError {
    constructor() {
        super("Voter can only vote once per poll");
    }
}