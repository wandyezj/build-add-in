import { test, expect, selectors, Page } from "@playwright/test";
import { navigateToPage } from "./navigateToPage";
import { getId, idEditButtonOpen, idEditButtonOpenSnip, idEditOpenSnipButtonNewSnip } from "../src/components/id";
import { Snip } from "../src/core/Snip";

const editPageUrl = "edit.html";
const editPageTitle = "Edit";

test("navigates to correct page title", async ({ browser }) => {
    // Use id attribute for test selectors
    selectors.setTestIdAttribute("id");

    const page = await navigateToPage(browser, editPageUrl, editPageTitle);
    await expect(page).toHaveTitle(editPageTitle);

    // Navigate to the Local Snips Drawer and create a new snip
    await page.getByTestId(getId(idEditButtonOpen)).click();
    await page.getByTestId(getId(idEditButtonOpenSnip)).click();
    await page.getByTestId(getId(idEditOpenSnipButtonNewSnip)).click();

    // Open the new snip
    await page.getByText("New Snip").first().click();
    const currentSnip = await getCurrentSnipToRun(page);
    expect(currentSnip.name).toBe("New Snip");
});

async function getCurrentSnipToRun(page: Page) {
    // way to view local storage.
    const snipJson = await page.evaluate(() => {
        return window.localStorage.getItem("currentSnipToRun");
    });

    if (snipJson === null) {
        throw new Error("currentSnipToRun is null");
    }

    const snip = JSON.parse(snipJson) as Snip;
    return snip;
}
