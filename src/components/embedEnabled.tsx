import { getHost } from "../core/globals";

export function embedEnabled(): boolean {
    const host = getHost();
    const enabled = host === Office.HostType.Excel || host === Office.HostType.Word;
    return enabled;
}
