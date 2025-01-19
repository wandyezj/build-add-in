import { Snip, completeSnip } from "./Snip";
import { defaultSnip, defaultSnipExcel } from "./defaultSnip";
import { getHost } from "./globals";
import { objectClone } from "./objectClone";

export function newDefaultSnip(): Snip {
    let snip = defaultSnip;

    try {
        // TODO: put behind switch that is defaulted to true
        const host = getHost();
        switch (host) {
            case Office.HostType.Excel:
                snip = defaultSnipExcel;
                break;
            default:
                break;
        }
    } catch {
        // If host hasn't been declared yet
    }
    return completeSnip(objectClone(snip));
}
