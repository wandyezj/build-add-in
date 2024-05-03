import { Snip, SnipReference, getSnipFromJson, getSnipJson, getSnipSource } from "./Snip";
import { LogTag, log } from "./log";
import { objectToJson } from "./objectToJson";
import { Settings, parseSettingsJson } from "./setting";

type Key =
    | typeof keyCurrentSnipReference
    | typeof keyCurrentSnipSource
    | typeof keyCurrentSnipToRun
    | typeof keySettings;

function keyGet(key: Key) {
    return window.localStorage.getItem(key);
}

function keyRemove(key: Key) {
    return window.localStorage.removeItem(key);
}

function keySet(key: Key, value: string) {
    return window.localStorage.setItem(key, value);
}

/**
 * The id of the snip that is currently being edited.
 * - The snip to load when the page first loads.
 * - Determines which snip to run.
 */
const keyCurrentSnipReference = "currentSnipId";
const keyCurrentSnipSource = "currentSnipSource";

export function saveCurrentSnipReference(reference: SnipReference) {
    const { id, source } = reference;
    log(LogTag.LocalStorage, `saveCurrentSnipId ${id}`);
    keySet(keyCurrentSnipReference, id);
    keySet(keyCurrentSnipSource, source);
}

export function loadCurrentSnipReference(): SnipReference | undefined {
    const id = keyGet(keyCurrentSnipReference) || undefined;
    const source = getSnipSource(keyGet(keyCurrentSnipSource) || undefined);
    if (id === undefined || source === undefined) {
        return undefined;
    }
    return { id, source };
}

export function deleteCurrentSnipReference() {
    keyRemove(keyCurrentSnipReference);
    keyRemove(keyCurrentSnipSource);
}

/**
 * The content of the current snip to run.
 */
const keyCurrentSnipToRun = "currentSnipToRun";

export function saveCurrentSnipToRun(snip: Snip) {
    const text = getSnipJson(snip);
    keySet(keyCurrentSnipToRun, text);
}

export function loadCurrentSnipToRun(): Snip | undefined {
    const text = keyGet(keyCurrentSnipToRun);
    if (text === null) {
        return undefined;
    }
    const snip = getSnipFromJson(text);
    return snip;
}

export function deleteCurrentSnipToRun(): void {
    keyRemove(keyCurrentSnipToRun);
}

const keySettings = "settings";

export function loadSettings(): Settings {
    const settingsJson = keyGet(keySettings) || "";
    const settings = parseSettingsJson(settingsJson);
    return settings;
}

export function saveSettings(settings: Settings) {
    const settingsJson = objectToJson(settings);
    keySet(keySettings, settingsJson);
}

export function deleteSettings() {
    keyRemove(keySettings);
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
