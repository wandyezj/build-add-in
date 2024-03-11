import { Snip } from "./Snip";
const currentSnipId = "currentSnipId";

export function saveCurrentSnipId(id: string) {
    window.localStorage.setItem(currentSnipId, id);
}

export function loadCurrentSnipId(): string | undefined {
    return window.localStorage.getItem(currentSnipId) || undefined;
}

export function deleteCurrentSnipId() {
    window.localStorage.removeItem(currentSnipId);
}

export function saveSnip(snip: Snip) {
    console.log("save", snip);
    window.localStorage.setItem(currentSnipId, JSON.stringify(snip));
}

export function loadSnip(): Snip | undefined {
    console.log("load");
    const snip = window.localStorage.getItem(currentSnipId);
    if (snip) {
        return JSON.parse(snip);
    }

    return undefined;
}

export function deleteSnip() {
    window.localStorage.removeItem(currentSnipId);
}
