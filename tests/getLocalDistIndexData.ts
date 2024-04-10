import * as fs from "fs";
import path from "path";
import { localDistPath } from "./distConstants";

/**
 * Local generated page from build
 */
const mainPageLocalDistDataPath = path.resolve(localDistPath, "index.html");

export function getLocalDistIndexData() {
    if (!fs.existsSync(mainPageLocalDistDataPath)) {
        throw new Error(`cannot find mainPageLocalDistDataPat ${mainPageLocalDistDataPath}`);
    }

    const mainPageLocalDistData = fs.readFileSync(mainPageLocalDistDataPath);
    return mainPageLocalDistData;
}
