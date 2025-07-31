import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright"; // 1
import { navigateToPage } from "./navigateToPage";
import { editPageTitle, editPageUrl } from "./constants";

test("should not have any automatically detectable accessibility issues", async ({ browser }) => {
    const page = await navigateToPage(browser, editPageUrl, editPageTitle);

    const accessibilityScanResults = await new AxeBuilder({ page }).exclude("#div-monaco-editor").analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
});
