import { getHost, Host } from "../globals";
import { getSetting } from "../setting";

export function enableEmbed(): boolean {
    const host = getHost();
    const enableForHost = host === Host.Excel || host === Host.Word;
    const enableSetting = getSetting("enableEmbed");
    const enabled = enableForHost && enableSetting;
    return enabled;
}
