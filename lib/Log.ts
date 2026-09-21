class GlobalLogCounter {
    static #instance: GlobalLogCounter | undefined;
    #names: Map<string, number> = new Map();

    private constructor() {}

    next(name: string) {
        const current = this.#names.get(name) ?? 0;
        this.#names.set(name, current + 1);
        return current;
    }

    static instance() {
        if (!GlobalLogCounter.#instance) {
            GlobalLogCounter.#instance = new GlobalLogCounter();
        }
        return GlobalLogCounter.#instance;
    }
}

/**
 * @public
 */
export class Log {
    static #enableTrace: boolean = true;

    /**
     * @public
     */
    static enable(enable: boolean = true) {
        Log.#enableTrace = enable;
    }

    /**
     * @public
     */
    static counter(name: string): number {
        return GlobalLogCounter.instance().next(name);
    }

    /**
     * @public
     */
    static itemType(itemName: string, item: unknown) {
        if (Log.#enableTrace) {
            console.log(itemName, typeof item, `isArray: ${Array.isArray(item)}`, item);
        }
    }

    /**
     * @public
     */
    static trace(trace: string, ...items: unknown[]) {
        if (Log.#enableTrace) {
            console.log(trace, ...items);
        }
    }

    /**
     * @public
     */
    static traceMethod(className: string, methodName: string, trace: string, ...items: unknown[]) {
        if (Log.#enableTrace) {
            console.log(className, methodName, trace, ...items);
        }
    }
}
