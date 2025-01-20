import { getSetting } from "../setting";

/**
 * Enable using a new snip that's specific per host.
 * This allows simplification of the individual default new snip on  a host.
 */
export function enableHostSpecificNewSnip(): boolean {
    const enable = getSetting("enableHostSpecificNewSnip");
    return enable;
}
