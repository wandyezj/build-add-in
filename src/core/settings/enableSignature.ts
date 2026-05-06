import { getSetting } from "../setting";
import { enableFeatureSignature } from "./enableFeatureSignature";

/**
 * Enable the signature button on the edit page
 */
export function enableSignature(): boolean {
    const enable = enableFeatureSignature() && getSetting("enableSignature");
    return enable;
}
