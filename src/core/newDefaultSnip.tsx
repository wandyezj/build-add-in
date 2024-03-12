import { Snip, completeSnip } from "./Snip";
import { defaultSnip } from "./defaultSnip";

export function newDefaultSnip(): Snip {
    return completeSnip(JSON.parse(JSON.stringify(defaultSnip)));
}
