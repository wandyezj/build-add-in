import { getSetting } from "../setting";

/**
 * Enable the import button on the edit page
 */
export function enableEditImport(): boolean {
    const enable = getSetting("enableEditImport");
    return enable;
}
