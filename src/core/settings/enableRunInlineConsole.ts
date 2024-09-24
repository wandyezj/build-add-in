import { getSetting } from "../setting";

/**
 * Enable inline console
 */
export function enableRunInlineConsole(): boolean {
    const enable = getSetting("enableRunInlineConsole");
    return enable;
}
