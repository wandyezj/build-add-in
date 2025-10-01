import { getSnipExportFormat } from "./settings/getSnipExportFormat";
import { SnipExportFormat } from "./settings/SnipExportFormat";
import { pruneSnipToExportSnip, type Snip } from "./Snip";
import { objectToJson } from "./util/objectToJson";
import { objectToYaml } from "./util/objectToYaml";

/**
 * Get save JSON string from a Snip.
 */
export function getSnipExportJson(snip: Snip): string {
    const pruned = pruneSnipToExportSnip(snip);
    const text = objectToJson(pruned);
    return text;
}

function getSnipExportYaml(snip: Snip): string {
    const pruned = pruneSnipToExportSnip(snip);
    const text = objectToYaml(pruned);
    return text;
}

export function getSnipExport(snip: Snip): string {
    const format = getSnipExportFormat();
    switch (format) {
        case SnipExportFormat.Json:
            return getSnipExportJson(snip);
        case SnipExportFormat.Yaml:
            return getSnipExportYaml(snip);
        default:
            throw new Error(`Unsupported export format: ${format}`);
    }
}
