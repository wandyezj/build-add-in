import { LocalStorageKey } from "./LocalStorageKey";

/**
 * Should the control panel be shown?
 * This shows additional settings that aren't normally visible.
 */
export function showControlPanel(): boolean {
    const value = localStorage.getItem(LocalStorageKey.ShowControlPanel);
    return value === "true";
}
