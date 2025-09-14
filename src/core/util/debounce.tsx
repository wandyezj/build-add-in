// Debounce utility to limit the rate a function fires.

const debounceMap = new Map<string, unknown>();

/**
 * Debounce a function call
 * This clears any previous timeout for the given id and set a new one.
 * @param id Unique identifier for the debounce instance. This can be used to clear the debounce.
 * @param delayMilliseconds Milliseconds to wait before executing the callback.
 * @param callback Callback function to execute after the delay.
 */
export function debounce(id: string, delayMilliseconds: number, callback: () => void) {
    let timeoutId: unknown = debounceMap.get(id);
    clearTimeout(timeoutId as number);
    timeoutId = setTimeout(callback, delayMilliseconds);
    debounceMap.set(id, timeoutId);
}

export function debounceClear(id: string) {
    const timeoutId = debounceMap.get(id);
    if (timeoutId) {
        clearTimeout(timeoutId as number);
        debounceMap.delete(id);
    }
}
