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

export enum LogTag {
    /**
     * Setup Sequence for editor
     */
    Setup = "Setup",
    /**
     * Setup sequence first tag
     */
    SetupStart = "SetupStart",
    /**
     * Setup sequence last tag
     */
    SetupEnd = "SetupEnd",

    CopyToClipboard = "CopyToClipboard",

    LocalStorage = "LocalStorage",

    MostRecentlyModifiedMetadata = "MostRecentlyModifiedMetadata",
    UpdateMonacoLibs = "UpdateMonacoLibs",
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
    UploadSignature = "UploadSignature",
}

// TODO: add timer between start and end tags with same prefix.

const tagsToLog = new Set<LogTag>(getLogTagsFromLocalStorage());

function getLogTagsFromLocalStorage(): LogTag[] {
    const rawTags = localStorage.getItem("log");
    if (!rawTags) {
        return [];
    }

    // Show all of the tags if the value is "all"
    if (rawTags === "all") {
        const excludeTags = [LogTag.Language];
        return Object.values(LogTag)
            .map((tag) => tag as LogTag)
            .filter((tag) => !excludeTags.includes(tag));
    }

    const tags = rawTags
        .split(/[, ]/)
        .map((tag) => tag.trim())
        .filter((tag) => Object.values(LogTag).includes(tag as LogTag)) as LogTag[];
    return tags;
}
