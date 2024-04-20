import * as fs from "fs";
import path from "path";
import { localDistPath } from "./distConstants";

export function getLocalDistData(subpath: string) {
    /**
     * Local generated file from build
     */
    const localDistDataPath = path.resolve(localDistPath, subpath);
    if (!fs.existsSync(localDistDataPath)) {
        throw new Error(`cannot find localDistDataPath ${localDistDataPath}`);
    }

    const localDistData = fs.readFileSync(localDistDataPath);
    return localDistData;
}
