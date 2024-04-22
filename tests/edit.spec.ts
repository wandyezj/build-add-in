import { test, expect, selectors } from "@playwright/test";
import { navigateToPage } from "./navigateToPage";
import { idEditButtonOpenSnip, idEditOpenSnipButtonNewSnip } from "../src/components/id";

const editPageUrl = "edit.html";
const editPageTitle = "Edit";

test("navigates to correct page title", async ({ browser }) => {
    // Use id attribute for test selectors
    selectors.setTestIdAttribute("id");

    const page = await navigateToPage(browser, editPageUrl, editPageTitle);
    await expect(page).toHaveTitle(editPageTitle);

    await page.getByTestId(idEditButtonOpenSnip).click();
    await page.getByTestId(idEditOpenSnipButtonNewSnip).click();

    // way to view local storage.
    // page.evaluate(() => {
    // })
});
