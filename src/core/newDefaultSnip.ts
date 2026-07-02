import { objectClone } from "./util/objectClone";
import { ExportSnip, Snip, completeSnip } from "./snip/Snip";
import {
    defaultSnip,
    defaultSnipExcel,
    defaultSnipOutlook,
    defaultSnipPowerPoint,
    defaultSnipWord,
} from "./defaultSnip";
import { getHost, Host } from "./globals";
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

function getHostSpecificSnip(host: Host): ExportSnip {
    switch (host) {
        case Host.Site:
            return defaultSnip;

        case Host.Excel:
            return defaultSnipExcel;

        case Host.PowerPoint:
            return defaultSnipPowerPoint;

        case Host.Word:
            return defaultSnipWord;

        case Host.Outlook:
            return defaultSnipOutlook;

        default:
            return defaultSnip;
    }
}
