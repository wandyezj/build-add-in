class StopWatch {
    constructor(private name: string) {}
    lastStart = 0;
    start() {
        this.lastStart = Date.now();
    }

    read(header: string = "") {
        const current = Date.now();
        const delta = current - this.lastStart;
        const milliseconds = delta;
        console.log(`[${this.name}] ${header} = ${milliseconds} ms`);
    }
}

export function getWatch(name: string) {
    return new StopWatch(name);
}
