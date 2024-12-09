import { Snip, completeSnip } from "./Snip";
import { defaultSnip } from "./defaultSnip";
import { objectClone } from "./util/objectClone";

export function newDefaultSnip(): Snip {
    return completeSnip(objectClone(defaultSnip));
}
