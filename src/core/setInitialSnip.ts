import { defaultSnip } from "./defaultSnip";
import { loadSnip, saveSnip } from "./storage";

/**
 * If there is no snip in storage, set the default snip.
 */
export function setInitialSnip() {
    if (loadSnip() === undefined) {
        saveSnip(defaultSnip);
    }
}
