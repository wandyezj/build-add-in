export function logGeneric(stream: "log" | "error", tag: LogTag, ...data: unknown[]) {
    if (tag === undefined) {
        console[stream]("Tag Unknown");
        return;
    }

    // Only log specific tags
    if (tagsToLog.has(tag)) {
        console[stream](...data);
    }
}

/**
 * direct all logging through the log function
 * This helps with debugging and testing
 * @param tag
 * @param data
 * @returns
 */
export function log(tag: LogTag, ...data: unknown[]) {
    logGeneric("log", tag, ...data);
}

export function logError(tag: LogTag, ...data: unknown[]) {
    logGeneric("error", tag, ...data);
}

// TODO: add timer between start and end tags with same prefix.

const tagsToLog = new Set<LogTag>(getLogTagsFromLocalStorage());

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
    ButtonNew = "ButtonNew",
    Embed = "Embed",
    UploadFile = "UploadFile",

    /**
     * Queries to the GitHub API
     */
    GitHubApi = "GitHubApi",
    Language = "Language",
}

function getLogTagsFromLocalStorage(): LogTag[] {
    const rawTags = localStorage.getItem("log");
    if (!rawTags) {
        return [];
    }
    const tags = rawTags
        .split(/[, ]/)
        .map((tag) => tag.trim())
        .filter((tag) => Object.values(LogTag).includes(tag as LogTag)) as LogTag[];
    return tags;
}
