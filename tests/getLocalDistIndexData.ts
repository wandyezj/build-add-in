import * as fs from "fs";
import path from "path";
import { getRootDirectory } from "./getRootDirectory";

/**
 * Local generated page from build
 */
const mainPageLocalDistDataPath = path.resolve(getRootDirectory(), "dist", "index.html");

export function getLocalDistIndexData() {
    if (!fs.existsSync(mainPageLocalDistDataPath)) {
        throw new Error(`cannot find mainPageLocalDistDataPat ${mainPageLocalDistDataPath}`);
    }

    const mainPageLocalDistData = fs.readFileSync(mainPageLocalDistDataPath);
    return mainPageLocalDistData;
}
