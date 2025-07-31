import { test, expect, Page } from "@playwright/test";
import { navigateToPage } from "./navigateToPage";
import {
    getId,
    idEditButtonCopyToClipboard,
    idEditButtonOpen,
    idEditButtonOpenSnip,
    idEditOpenSnipButtonNewSnip,
} from "../src/components/id";
import { Snip } from "../src/core/Snip";
import { editPageUrl, editPageTitle } from "./constants";

test("edit page basic", async ({ browser }) => {
    // Use id attribute for test selectors

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

    // Copy to clipboard
    await page.getByTestId(getId(idEditButtonCopyToClipboard)).click();
    const clipboardText = await page.evaluate(() => {
        return navigator.clipboard.readText();
    });
    const clipboardSnip = JSON.parse(clipboardText) as Snip;
    expect(clipboardSnip.name).toBe(currentSnip.name);
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
