import { test, expect, selectors } from "@playwright/test";
import { navigateToPage } from "./navigateToPage";
import { getId, idEditButtonOpen, idEditButtonOpenSnip, idEditOpenSnipButtonNewSnip } from "../src/components/id";

const editPageUrl = "edit.html";
const editPageTitle = "Edit";

test("navigates to correct page title", async ({ browser }) => {
    // Use id attribute for test selectors
    selectors.setTestIdAttribute("id");

    const page = await navigateToPage(browser, editPageUrl, editPageTitle);
    await expect(page).toHaveTitle(editPageTitle);

    await page.getByTestId(getId(idEditButtonOpen)).click();
    await page.getByTestId(getId(idEditButtonOpenSnip)).click();
    await page.getByTestId(getId(idEditOpenSnipButtonNewSnip)).click();

    // way to view local storage.
    // page.evaluate(() => {
    // })
});
