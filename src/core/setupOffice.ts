import { Host, Platform, setHost, setPlatform } from "./globals";

export function getHostFromOfficeHost(officeHost: Office.HostType): Host {
    switch (officeHost) {
        case Office.HostType.Excel:
            return Host.Excel;
        case Office.HostType.PowerPoint:
            return Host.PowerPoint;
        case Office.HostType.Word:
            return Host.Word;
        case Office.HostType.Outlook:
            return Host.Outlook;
        default:
            return Host.Site;
    }
}

export function getPlatformFromOfficePlatform(officePlatform: Office.PlatformType): Platform {
    switch (officePlatform) {
        case Office.PlatformType.PC:
            return Platform.Windows;
        case Office.PlatformType.Mac:
            return Platform.Mac;
        case Office.PlatformType.OfficeOnline:
            return Platform.Web;
        default:
            return Platform.Site;
    }
}

export async function setupOffice() {
    // Calling Office.onReady after setup loads the UI faster.
    await Office.onReady(({ host, platform }) => {
        console.log(`Office is ready
Host: ${host}
Platform: ${platform}`);
        setHost(getHostFromOfficeHost(host));
        setPlatform(getPlatformFromOfficePlatform(platform));
    });
}
