import { getHost } from "./globals";
import { getSetting } from "./setting";

export function enableEmbed(): boolean {
    const host = getHost();
    const enableForHost = host === Office.HostType.Excel || host === Office.HostType.Word;
    const enableSetting = getSetting("enableEmbed");
    const enabled = enableForHost && enableSetting;
    return enabled;
}
