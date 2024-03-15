/**
 * direct all logging through the log function
 * This helps with debugging and testing
 * @param tag
 * @param data
 * @returns
 */
export function log(tag: LogTag, ...data: unknown[]) {
    if (tag === undefined) {
        console.log("Tag Unknown");
        return;
    }
    console.log(...data);
}

export enum LogTag {
    /**
     * Setup Sequence for editor
     */
    Setup = "setup",
    /**
     * Setup sequence first tag
     */
    SetupStart = "setupStart",
    /**
     * Setup sequence last tag
     */
    SetupEnd = "setupEnd",

    CopyToClipboard = "copyToClipboard",

    LocalStorage = "storage",
}
