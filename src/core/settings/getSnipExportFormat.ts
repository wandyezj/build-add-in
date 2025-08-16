import { getSetting } from "../setting";
import { SnipExportFormat } from "./SnipExportFormat";

/**
 * Get the snip export format.
 */
export function getSnipExportFormat(): SnipExportFormat {
    const format = getSetting("snipExportFormat");
    return format;
}
