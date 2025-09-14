// Only have a single version of snip.

import { objectToJson } from "./util/objectToJson";

// If need to update in a non-compatible way, create a transform function to update existing snips.
/**
 * A Snip
 */
export interface Snip {
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
     * Author of the snip.
     */
    author?: SnipAuthor;

    /**
     * Files in the snip.
     */
    files: { [key: string]: SnipFile } & Record<"typescript" | "html" | "css" | "libraries", SnipFile>;
}

/**
 * Author of the snip.
 * Verified by GitHub GPG signature.
 */
export interface SnipAuthor {
    /**
     * The source of the public key to verify the signature.
     * For now, only GitHub GPG key is supported.
     */
    source: "GitHub";

    /**
     * GitHub username of the author.
     */
    username: string;

    /**
     * GPG signature of the snip.
     */
    signature: string;
}

export interface SnipFile {
    content: string;
    language: string;
}

/**
 * A Snip used for import / export.
 */
export type ExportSnip = Pick<Snip, "name" | "author" | "files">;

export type SnipMetadata = Pick<Snip, "id" | "name" | "modified">;

export type SnipMetadataWithSource = SnipMetadata & { source: SnipSource };

/**
 * Where is the snips storage? Where is the source code of the snip?
 * local - in the browser's local storage indexDb
 * embed - in the documents html
 */
export type SnipSource = "local" | "embed";

export function getSnipSource(source: string | undefined): SnipSource | undefined {
    const valid = typeof source === "string" && ["local", "embed"].includes(source);
    if (valid) {
        return source as SnipSource;
    }
    return undefined;
}

export type SnipWithSource = Snip & { source: SnipSource };

/**
 * Reference to a snip.
 * Used to refer to a snip without the content.
 * source - where to look
 * id - which snip to look for
 */
export type SnipReference = Pick<SnipWithSource, "id" | "source">;

const requiredKeys = ["typescript", "html", "css", "libraries"];

type Maybe<T, K extends keyof T> = Partial<Pick<T, K>>;

function validObject(snip: object): boolean {
    const valid = typeof snip === "object";
    return valid;
}

function validSnipId(snip: Maybe<Snip, "id">): boolean {
    const valid = typeof snip.id === "string";
    return valid;
}

function validSnipModified(snip: Maybe<Snip, "modified">): boolean {
    const valid = typeof snip.modified === "number";
    return valid;
}

function validSnipName(snip: Maybe<Snip, "name">): boolean {
    const valid = typeof snip.name === "string";
    return valid;
}

function validSnipFiles(snip: Partial<Snip>): boolean {
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

function getSnipValidProperties(snip: Snip): { [property in keyof Snip]: boolean } {
    return {
        id: validSnipId(snip),
        modified: validSnipModified(snip),
        name: validSnipName(snip),
        files: validSnipFiles(snip),
    };
}

export function isValidExportSnip(snip: ExportSnip): boolean {
    if (!validObject(snip)) {
        return false;
    }
    const valid = getSnipValidProperties(snip as Snip);
    const isValid = valid.name && valid.files;
    return isValid;
}

export function isValidSnip(snip: Snip): boolean {
    if (!validObject(snip)) {
        return false;
    }
    const valid = getSnipValidProperties(snip);
    const isValid = valid.id && valid.modified && valid.name && valid.files;
    return isValid;
}

/**
 * Make sure the snip is valid and only contains what is expected.
 */
export function pruneSnip(snip: Snip): Snip {
    const files: typeof snip.files = {} as typeof snip.files;
    for (const key of requiredKeys) {
        files[key] = {
            language: snip.files[key].language,
            content: snip.files[key].content,
        };
    }

    const { id, name, modified, author } = snip;
    return {
        id,
        modified,
        name,
        author,
        files,
    };
}

/**
 * Get the snip doc text to sign.
 */
export function getSnipDocText(snip: Snip): string {
    const { name, files } = pruneSnipForExport(snip);
    const hashSnip = { name, files };
    const text = objectToJson(hashSnip);
    return text;
}

export function pruneSnipForExport(snip: Snip): ExportSnip {
    const { name, author, files } = pruneSnip(snip);

    return {
        name,
        author,
        files,
    };
}

export function pruneSnipToSnipMetadata(snip: Pick<Snip, "id" | "modified" | "name">): SnipMetadata {
    const { id, name, modified } = snip;
    return {
        id,
        modified,
        name,
    };
}

/**
 * Is this JSON a valid export snip?
 * Can this snip be imported?
 * @param value - JSON string to parse
 */
export function isValidSnipExportJson(value: string): boolean {
    try {
        const snip = JSON.parse(value);
        const valid = isValidExportSnip(snip);
        return valid;
    } catch (e) {
        return false;
    }
}

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
        if (!isValidSnip(snip)) {
            return undefined;
        }
        const pruned = pruneSnip(snip);
        return pruned;
    } catch (e) {
        return undefined;
    }
}

/**
 * Gets a Snip from a JSON string
 * @param value Json string to parse
 * @returns pruned Snip if the value is valid, otherwise undefined
 */
export function getExportSnipFromExportJson(value: string): ExportSnip | undefined {
    try {
        const snip = JSON.parse(value);
        if (!isValidExportSnip(snip)) {
            return undefined;
        }
        const pruned = pruneSnipForExport(snip);
        return pruned;
    } catch (e) {
        return undefined;
    }
}

export function completeSnip(piece: ExportSnip, options?: { id?: string }): Snip {
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
