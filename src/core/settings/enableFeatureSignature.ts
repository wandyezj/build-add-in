import { getSetting } from "../setting";

/**
 * Enable the signature feature.
 */
export function enableFeatureSignature(): boolean {
    const enable = getSetting("enableFeatureSignature");
    return enable;
}
