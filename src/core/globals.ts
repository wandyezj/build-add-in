let globalHost: Office.HostType | undefined = undefined;
let globalPlatform: Office.PlatformType | undefined = undefined;

export function setHost(host: Office.HostType) {
    globalHost = host;
}

export function getHost(): Office.HostType {
    if (globalHost === undefined) {
        throw new Error("Host not set");
    }
    return globalHost;
}

export type SupportedHostName = "excel" | "powerpoint" | "word";

export function getHostName(): SupportedHostName {
    const host = getHost();
    // Only includes hosts that are supported.
    switch (host) {
        case Office.HostType.Excel:
            return "excel";
        case Office.HostType.PowerPoint:
            return "powerpoint";
        case Office.HostType.Word:
            return "word";
        default:
            // Default to Excel for testing.
            return "excel";
    }
}

export function setPlatform(platform: Office.PlatformType) {
    globalPlatform = platform;
}

export function getPlatform(): Office.PlatformType {
    if (globalPlatform === undefined) {
        throw new Error("Platform already set");
    }
    return globalPlatform;
}
