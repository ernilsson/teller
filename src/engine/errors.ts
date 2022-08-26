export class EngineError extends Error {}

export class InvalidStateError extends EngineError {
    constructor(msg: string) {
        super(msg);
    }
}

export class InvalidArgumentError extends EngineError {
    constructor(msg: string) {
        super(msg);
    }
}

export class IllegalOperationError extends EngineError {
    constructor(msg: string) {
        super(msg);
    }
}