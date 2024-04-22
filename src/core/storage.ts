import { SnipReference, getSnipSource } from "./Snip";
import { LogTag, log } from "./log";

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
