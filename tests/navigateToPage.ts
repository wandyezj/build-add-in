import { expect, Page, Browser } from "@playwright/test";
import { getLocalDistData } from "./getLocalDistData";

/**
 * true - uses local dist for testing
 * false - point to production url
 */
const useLocalDist = true;

const rootUrl = "https://wandyezj.github.io/build-add-in";

export async function navigateToPage(browser: Browser, subpath: string, title: string): Promise<Page> {
    // Create a separate browser context for each test
    const context = await browser.newContext();
    const page = await context.newPage();

    const pageUrl = rootUrl + "/" + subpath;
    // redirect to local data
    if (useLocalDist) {
        // interceptor to replace content of the page
        page.route(`${rootUrl}/*`, (route, request) => {
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
