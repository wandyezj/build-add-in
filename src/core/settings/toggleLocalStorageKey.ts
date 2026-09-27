/**
 * Toggle a localStorage key.
 * If the key is set to "true", it will be removed.
 * Otherwise, it will be set to "true".
 */
import { LocalStorageKey } from "./LocalStorageKey";

export function toggleLocalStorageKey(localStorageKey: LocalStorageKey) {
    if (localStorage.getItem(localStorageKey) === "true") {
        localStorage.removeItem(localStorageKey);
    } else {
        localStorage.setItem(localStorageKey, "true");
    }
}
