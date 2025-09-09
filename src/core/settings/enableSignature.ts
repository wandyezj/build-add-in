import { getSetting } from "../setting";

/**
 * Enable the signature button on the edit page
 */
export function enableSignature(): boolean {
    const enable = getSetting("enableSignature");
    return enable;
}
