export class ApiError extends Error {
    constructor(msg: string) {
        super(msg);
    }

}

export class InvalidCommandError extends ApiError {
    constructor(msg: string) {
        super(msg);
    }
}

export class IllegalStateError extends ApiError {
    constructor(msg: string) {
        super(msg);
    }
}