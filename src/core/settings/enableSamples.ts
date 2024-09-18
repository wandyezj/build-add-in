import { getSetting } from "../setting";

/**
 * Enable open menu samples button.
 */
export function enableSamples(): boolean {
    const enable = getSetting("enableSamples");
    return enable;
}
