import { test, expect } from "@playwright/test";
import { mainPageTitle, navigateToMainPage } from "./navigateToMainPage";

test("navigates to correct page title", async ({ browser }) => {
    const page = await navigateToMainPage(browser);
    await expect(page).toHaveTitle(mainPageTitle);
});
