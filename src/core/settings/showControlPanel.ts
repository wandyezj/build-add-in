/**
 * Should the control panel be shown?
 * This shows additional settings that aren't normally visible.
 */
export function showControlPanel(): boolean {
    const value = localStorage.getItem("showControlPanel");
    return value === "true";
}
