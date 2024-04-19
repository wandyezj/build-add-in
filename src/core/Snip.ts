// Only have a single version of snip.

import { objectToJson } from "./objectToJson";

// If need to update in a non-compatible way, create a transform function to update existing snips.
/**
 * A Snip
 */
export interface Snip extends PrunedSnip {
    /**
     * Unique ID to identify the snip from others.
     * ID is used to update the snip in storage.
     */
    id: string;

    /**
     * Timestamp of the last modification
     */
    modified: number;

    /**
     * Name of the snip.
     */
    name: string;

    /**
     * Files in the snip.
     */
    files: { [key: string]: SnipFile } & Record<"typescript" | "html" | "css" | "libraries", SnipFile>;
}

export interface SnipFile {
    content: string;
    language: string;
}

/**
 * A Snip.
 * Used for export.
 */
export type PrunedSnip = Pick<Snip, "name" | "files">;

export type SnipMetadata = Pick<Snip, "id" | "name" | "modified">;

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
export function pruneSnip(snip: Snip): PrunedSnip {
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
 * Get save JSON string from a Snip.
 */
export function getSnipJson(snip: Snip): string {
    const pruned = pruneSnip(snip);
    const text = objectToJson(pruned);
    return text;
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
        const pruned = pruneSnip(snip);
        const complete = completeSnip(pruned);
        return complete;
    } catch (e) {
        return undefined;
    }
}

export function completeSnip(piece: PrunedSnip, options?: { id?: string }): Snip {
    const now = Date.now();

    const idPostfix = options?.id ?? "";
    // Unique ID is the timestamp
    const id = `${now}${idPostfix}`;
    // Modified is when it was created
    const modified = now;

    const complete = {
        id,
        modified,
        ...piece,
    };
    return complete;
}
