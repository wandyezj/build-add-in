import { getSetting } from "../setting";

/**
 * Enable AI features in the UI.
 */
export function enableAi(): boolean {
    const enable = getSetting("enableAi");
    return enable;
}
