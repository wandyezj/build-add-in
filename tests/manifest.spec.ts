import { test, expect } from "@playwright/test";
import { localDistManifestProductionPath, localDistManifestProductionOutlookPath } from "./distConstants";
import * as fs from "fs";
import path from "path";

/**
 * Verify the Production manifests created by the build.
 */
test("Production manifests are free of (local)", async () => {
    const productionManifests = [localDistManifestProductionPath, localDistManifestProductionOutlookPath];
    productionManifests.forEach((manifestPath) => {
        // The build process should have created the manifest files - did you run `npm run build`?
        expect(fs.existsSync(manifestPath), `manifestPath ${manifestPath} exists`).toBeTruthy();

        const data = fs.readFileSync(manifestPath);

        // check for presence of (local) which should not happen.
        const expectLocal = false;
        const hasLocal = data.includes("(local)");
        expect(hasLocal, `${path.basename(manifestPath)} replaces local`).toBe(expectLocal);
    });
});
