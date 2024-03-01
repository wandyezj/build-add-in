import { Snip, defaultSnip } from "./Snip";

const currentSnipId = "currentSnipId";

export function saveSnip(snip: Snip) {
    window.localStorage.setItem(currentSnipId, JSON.stringify(snip));
}

export function loadSnip(): Snip {
    const snip = window.localStorage.getItem(currentSnipId);
    if (snip) {
        return JSON.parse(snip);
    } else {
        return defaultSnip;
    }
}
