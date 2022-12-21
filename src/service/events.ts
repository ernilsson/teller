export interface Event {
    type: string
    payload: any
}

export interface Listener {
    onEvent(event: Event): void
}

export class Bus {
    constructor(private listeners: Listener[]) {}

    register(listener: Listener) {
        this.listeners.push(listener)
    }

    deregister(listener: Listener) {
        this.listeners = this.listeners.filter(l => l !== listener)
    }

    broadcast(event: Event) {
        this.listeners.forEach(listener => listener.onEvent(event))
    }
}