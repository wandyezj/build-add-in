/**
 * A map that manages promises by an ID.
 * Wraps the creation, resolution, and rejection of promises associated with specific IDs.
 * @beta
 */
export class PromiseMap {
    // resultId -> resolve and reject functions.
    #promiseMap: Map<string, { resolve: (value: unknown) => void; reject: (value: unknown) => void }> = new Map();

    /**
     * Gets the list of IDs for which promises currently exist.
     * @beta
     */
    get ids(): string[] {
        return Array.from(this.#promiseMap.keys());
    }

    /**
     * Create a new promise associated with the specified ID.
     * @beta
     * @param id The ID for which to create a promise.
     * @returns A promise associated with the specified ID.
     */
    create(id: string): Promise<unknown> {
        const { promise, resolve, reject } = Promise.withResolvers();
        this.#promiseMap.set(id, { resolve, reject });
        return promise;
    }

    /**
     * Resolve the promise associated with the specified ID.
     * @beta
     * @param id The ID of the promise to resolve.
     * @param value The value to resolve the promise with.
     */
    resolve(id: string, value: unknown): void {
        const entry = this.#promiseMap.get(id);
        if (entry) {
            entry.resolve(value);
            this.#promiseMap.delete(id);
        }
    }

    /**
     * Reject the promise associated with the specified ID.
     * @beta
     * @param id The ID of the promise to reject.
     * @param value The value to reject the promise with.
     */
    reject(id: string, value: unknown): void {
        const entry = this.#promiseMap.get(id);
        if (entry) {
            entry.reject(value);
            this.#promiseMap.delete(id);
        }
    }
}
