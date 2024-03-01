import { expect, Page, Browser } from "@playwright/test";
import { getLocalDistIndexData } from "./getLocalDistIndexData";

/**
 * true - uses local dist for testing
 * false - point to production url
 */
const useLocalDist = true;

const mainPageUrl = "https://wandyezj.github.io/website";
export const mainPageTitle = "Website";

export async function navigateToMainPage(browser: Browser): Promise<Page> {
    // Create a separate browser context for each test
    const context = await browser.newContext();
    const page = await context.newPage();

    // redirect to local data
    if (useLocalDist) {
        // interceptor to replace content of the page
        page.route(mainPageUrl, (route) => {
            route.fulfill({
                body: getLocalDistIndexData(),
            });
        });
    }

    await page.goto(mainPageUrl);

    // Check that the page is the right one
    await expect(page).toHaveTitle(mainPageTitle);

    return page;
}
