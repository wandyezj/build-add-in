import { getHostName, SupportedHostName } from "../globals";
import { getSetting } from "../setting";

export function enableEmbed(): boolean {
    const host = getHostName();
    const enabledHosts: SupportedHostName[] = ["word", "excel", "powerpoint"];
    const enableForHost = enabledHosts.includes(host);
    const enableSetting = getSetting("enableEmbed");
    const enabled = enableSetting && enableForHost;
    return enabled;
}
