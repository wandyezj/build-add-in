import { expect, Page, Browser } from "@playwright/test";
import { getLocalDistData } from "./getLocalDistData";
import { getSource, Source } from "./getSource";

const rootUrlLocal = "https://localhost:3000";
const rootUrlProduction = "https://wandyezj.github.io/build-add-in";

export async function navigateToPage(browser: Browser, subpath: string, title: string): Promise<Page> {
    // Create a separate browser context for each test

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();
    const useSource = getSource();
    const rootUrl = useSource === Source.Localhost ? rootUrlLocal : rootUrlProduction;
    const pageUrl = rootUrl + "/" + subpath;

    // redirect to local data
    if (useSource === Source.Dist) {
        // interceptor to replace content of the page
        await page.route(`${rootUrl}/*`, (route, request) => {
            const url = request.url();
            const subpath = url.substring(rootUrl.length + 1);
            const body = getLocalDistData(subpath);
            route.fulfill({
                body,
            });
        });
    }

    await page.goto(pageUrl);

    // Check that the page is the right one
    await expect(page).toHaveTitle(title);

    return page;
}
