import { deleteStartupSnipId, loadStartupSnip } from "../core/source/embedSingleStartupSnip";
import { saveStartupSnipToRun } from "../core/storage";

export async function getStartupSnip() {
    // Load the startup snip from embed

    const snip = await loadStartupSnip().catch((e) => {
        // if there is an error clear it out.
        console.error(e);
        deleteStartupSnipId();
        return undefined;
    });
    return snip;
}

export async function isStartupSnip(): Promise<boolean> {
    const snip = await getStartupSnip();
    return snip !== undefined;
}

/**
 * Redirect to edit view, with reset that will be caught on this return.
 */
export async function run() {
    // Save it to local storage so it can be loaded in the run
    const snip = await getStartupSnip();
    if (snip === undefined) {
        return;
    }
    saveStartupSnipToRun(snip);

    // redirect to edit and allow back
    window.location.href = "./run.html#shared";
}
