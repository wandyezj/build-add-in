/**
 * Toggle a localStorage key.
 * If the key is set to "true", it will be removed.
 * Otherwise, it will be set to "true".
 */
export function toggleLocalStorageKey(localStorageKey: string) {
    if (localStorage.getItem(localStorageKey) === "true") {
        localStorage.removeItem(localStorageKey);
    } else {
        localStorage.setItem(localStorageKey, "true");
    }
}
