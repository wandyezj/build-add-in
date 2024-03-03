import { Snip } from "./Snip";
const currentSnipId = "currentSnipId";

export function saveSnip(snip: Snip) {
    window.localStorage.setItem(currentSnipId, JSON.stringify(snip));
}

export function loadSnip(): Snip | undefined {
    const snip = window.localStorage.getItem(currentSnipId);
    if (snip) {
        return JSON.parse(snip);
    }

    return undefined;
}
