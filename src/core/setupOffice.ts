import { setHost, setPlatform } from "./globals";

export async function setupOffice() {
    // Calling Office.onReady after setup loads the UI faster.
    await Office.onReady(({ host, platform }) => {
        console.log(`Office is ready
Host: ${host}
Platform: ${platform}`);
        setHost(host);
        setPlatform(platform);
    });
}
