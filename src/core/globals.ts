export enum Host {
    Site = "Site",
    Word = "Word",
    Excel = "Excel",
    PowerPoint = "PowerPoint",
    Outlook = "Outlook",
}

export enum Platform {
    Site = "Site",
    Windows = "Windows",
    Web = "Web",
    Mac = "Mac",
}

let globalHost: Host | undefined = undefined;
let globalPlatform: Platform | undefined = undefined;

export function setHost(host: Host) {
    globalHost = host;
}

export function getHost(): Host {
    if (globalHost === undefined) {
        throw new Error("Host not set");
    }
    return globalHost;
}

export type SupportedHostName = "excel" | "powerpoint" | "word" | "outlook" | "site";

export function getHostName(): SupportedHostName {
    const host = getHost();
    // Only includes hosts that are supported.
    switch (host) {
        case Host.Excel:
            return "excel";
        case Host.PowerPoint:
            return "powerpoint";
        case Host.Word:
            return "word";
        case Host.Outlook:
            return "outlook";
        case Host.Site:
            return "site";
        default:
            // Default to Excel for testing.
            return "excel";
    }
}

export function setPlatform(platform: Platform) {
    globalPlatform = platform;
}

export function getPlatform(): Platform {
    if (globalPlatform === undefined) {
        throw new Error("Platform not set");
    }
    return globalPlatform;
}
