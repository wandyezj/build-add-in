import * as fs from "fs";
import path from "path";

export function getRootDirectory() {
    const paths = [".", ".."];

    for (const p of paths) {
        const test = path.resolve(p, "src");
        if (fs.existsSync(test)) {
            return p;
        }
    }

    throw new Error("cannot find root directory");
}
