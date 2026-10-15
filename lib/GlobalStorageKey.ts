/**
 * Callback for when a global storage key changes.
 *
 * @beta
 */
export type GlobalStorageKeyChange = (options: { oldValue: string | undefined; newValue: string | undefined }) => void;

/**
 * Callback for updating the value of a global storage key.
 *
 * @beta
 */
export type GlobalStorageKeyUpdate = (current: string | undefined) => Promise<string>;

/**
 * A class representing a global storage key with change notifications and update locks.
 *
 * @beta
 */

export class GlobalStorageKey {
    #key: string = "";
    #lockName: string;
    #onChange: GlobalStorageKeyChange | undefined;

    /**
     * Creates a new instance of the GlobalStorageKey class.
     * @beta
     *
     * @param key The localstorage key name.
     * @param onChange The callback function to be invoked when the value of the global storage key changes.
     */
    constructor(key: string, onChange?: GlobalStorageKeyChange) {
        this.#key = key;
        this.#lockName = `localstorage-${key}`;
        this.#onChange = onChange;
        window.addEventListener("storage", (event: StorageEvent) => {
            if (event.key === key) {
                const newValue = event.newValue ?? undefined;
                const oldValue = event.oldValue ?? undefined;
                this.#onChange?.({ newValue, oldValue });
            }
        });
    }

    /**
     * Sets the change callback for the global storage key.
     *
     * @beta
     */
    set onChange(onChange: GlobalStorageKeyChange | undefined) {
        this.#onChange = onChange;
    }

    /**
     * Reads the current value of the global storage key.
     * @beta
     *
     * @returns The current value of the global storage key, or undefined if it does not exist.
     */
    read() {
        const value = localStorage.getItem(this.#key) ?? undefined;
        return value;
    }

    /**
     * Writes a new value to the global storage key.
     * @beta
     *
     * @param value The new value to write to the global storage key.
     */
    write(value: string): void {
        localStorage.setItem(this.#key, value);
    }

    /**
     * Remove the global storage key.
     * @beta
     */
    remove(): void {
        localStorage.removeItem(this.#key);
    }

    /**
     * Update the value of the global storage key using a navigator lock.
     * @beta
     *
     * @param doUpdate The callback function to update the value of the global storage key.
     * @returns A promise that resolves once the update is complete.
     */
    async update(doUpdate: GlobalStorageKeyUpdate): Promise<void> {
        await navigator.locks.request(this.#lockName, async () => {
            const current = this.read();
            const update = await doUpdate(current);
            this.write(update);
        });
    }
}
