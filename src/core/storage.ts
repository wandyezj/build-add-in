import { Snip, SnipReference, getSnipFromJson, getSnipJson, getSnipSource } from "./Snip";
import { LogTag, log } from "./log";

function keyGet(key: string) {
    return window.localStorage.getItem(key);
}

function keyRemove(key: string) {
    return window.localStorage.remove(key);
}

function keySet(key: string, value: string) {
    return window.localStorage.setItem(key, value);
}

/**
 * The id of the snip that is currently being edited.
 * - The snip to load when the page first loads.
 * - Determines which snip to run.
 */
const currentSnipReference = "currentSnipId";
const currentSnipSource = "currentSnipSource";

export function saveCurrentSnipReference(reference: SnipReference) {
    const { id, source } = reference;
    log(LogTag.LocalStorage, `saveCurrentSnipId ${id}`);
    window.localStorage.setItem(currentSnipReference, id);
    window.localStorage.setItem(currentSnipSource, source);
}

export function loadCurrentSnipReference(): SnipReference | undefined {
    const id = window.localStorage.getItem(currentSnipReference) || undefined;
    const source = getSnipSource(window.localStorage.getItem(currentSnipSource) || undefined);
    if (id === undefined || source === undefined) {
        return undefined;
    }
    return { id, source };
}

export function deleteCurrentSnipReference() {
    window.localStorage.removeItem(currentSnipReference);
    window.localStorage.removeItem(currentSnipSource);
}

/**
 * The content of the current snip to run.
 */
const currentSnipToRun = "currentSnipToRun";

export function saveCurrentSnipToRun(snip: Snip) {
    const text = getSnipJson(snip);
    window.localStorage.setItem(currentSnipToRun, text);
}

export function loadCurrentSnipToRun(): Snip | undefined {
    const text = window.localStorage.getItem(currentSnipToRun);
    if (text === null) {
        return undefined;
    }
    const snip = getSnipFromJson(text);
    return snip;
}

export function deleteCurrentSnipToRun(): void {
    window.localStorage.removeItem(currentSnipToRun);
}

// export function saveSnip(snip: Snip) {
//     console.log("save", snip);
//     window.localStorage.setItem(currentSnipId, JSON.stringify(snip));
// }

// export function loadSnip(): Snip | undefined {
//     console.log("load");
//     const snip = window.localStorage.getItem(currentSnipId);
//     if (snip) {
//         return JSON.parse(snip);
//     }

//     return undefined;
// }

// export function deleteSnip() {
//     window.localStorage.removeItem(currentSnipId);
// }
