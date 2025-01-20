import { ExportSnip, Snip, completeSnip } from "./Snip";
import {
    defaultSnip,
    defaultSnipExcel,
    defaultSnipOutlook,
    defaultSnipPowerPoint,
    defaultSnipWord,
} from "./defaultSnip";
import { getHost } from "./globals";
import { objectClone } from "./objectClone";
import { enableHostSpecificNewSnip } from "./settings/enableHostSpecificNewSnip";

export function newDefaultSnip(): Snip {
    let snip = defaultSnip;

    if (enableHostSpecificNewSnip()) {
        try {
            const host = getHost();
            snip = getHostSpecificSnip(host);
        } catch {
            // If host hasn't been declared yet
        }
    }
    return completeSnip(objectClone(snip));
}

function getHostSpecificSnip(host: Office.HostType): ExportSnip {
    switch (host) {
        case Office.HostType.Excel:
            return defaultSnipExcel;

        case Office.HostType.PowerPoint:
            return defaultSnipPowerPoint;

        case Office.HostType.Word:
            return defaultSnipWord;

        case Office.HostType.Outlook:
            return defaultSnipOutlook;

        default:
            return defaultSnip;
    }
}
