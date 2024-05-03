import { getHost } from "./globals";
import { getSettings } from "./setting";

export function embedEnabled(): boolean {
    const host = getHost();
    const enableForHost = host === Office.HostType.Excel || host === Office.HostType.Word;
    const enableSetting = getSettings().enableEmbed;
    const enabled = enableForHost && enableSetting;
    return enabled;
}
