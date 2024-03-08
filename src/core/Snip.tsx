export interface Snip {
    name: string;
    files: { [key: string]: SnipFile } & Record<"typescript" | "html" | "css" | "libraries", SnipFile>;
}

export interface SnipFile {
    content: string;
    language: string;
}

const requiredKeys = ["typescript", "html", "css", "libraries"];

function isSnipJson(snip: Snip): boolean {
    if (typeof snip.name !== "string") {
        return false;
    }

    if (typeof snip.files !== "object") {
        return false;
    }

    for (const key of Object.getOwnPropertyNames(snip.files)) {
        const file = snip.files[key];
        if (typeof file !== "object") {
            return false;
        }

        if (typeof file.content !== "string") {
            return false;
        }

        if (typeof file.language !== "string") {
            return false;
        }
    }

    // All required keys must be present
    const names = Object.getOwnPropertyNames(snip.files);
    for (const key of requiredKeys) {
        if (!names.includes(key)) {
            return false;
        }
    }

    return true;
}

/**
 * Make sure the snip is valid and only contains what is expected.
 */
function pruneSnipJson(snip: Snip): Snip {
    const files: typeof snip.files = {} as typeof snip.files;
    for (const key of requiredKeys) {
        files[key] = {
            content: snip.files[key].content,
            language: snip.files[key].language,
        };
    }

    return {
        name: snip.name,
        files,
    };
}

/**
 * Gets a Snip from a JSON string
 * @param value Json string to parse
 * @returns pruned Snip if the value is valid, otherwise undefined
 */
export function getSnipFromJson(value: string): Snip | undefined {
    try {
        const snip = JSON.parse(value);
        if (!isSnipJson(snip)) {
            return undefined;
        }
        const pruned = pruneSnipJson(snip);
        return pruned;
    } catch (e) {
        return undefined;
    }
}
