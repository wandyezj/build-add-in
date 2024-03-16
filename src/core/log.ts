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
    // Only log specific tags
    if (tagsToLog.has(tag)) {
        console.log(...data);
    }
}

// TODO: add timer between start and end tags with same prefix.

const tagsToLog = new Set<LogTag>([]);

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

    MostRecentlyModifiedMetadata = "mostRecentlyModifiedMetadata",
    UpdateMonacoLibs = "updateMonacoLibs",
    ButtonImport = "ButtonImport",
    ButtonCopy = "ButtonCopy",
    ButtonDelete = "ButtonDelete",
    LoadMonacoLibs = "LoadMonacoLibs",
}
