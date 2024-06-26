// Ids for testing purposes
// Each id should apply to a single component

/**
 * Location: Edit page
 * Button that opens the local snips drawer.
 */
export const idEditButtonOpen = "button-open";

/**
 * Location: Edit page
 * Button that copies the current snip to the clipboard.
 */
export const idEditButtonCopyToClipboard = "button-copy-to-clipboard";

/**
 * Location: Edit page
 * Button that opens the local snips drawer.
 */
export const idEditButtonOpenSnip = "button-open-snip";

/**
 * Location: Edit page -> Local snips drawer
 * Button that creates a new snip.
 */
export const idEditOpenSnipButtonNewSnip = "button-local-snips-new-snip";

export type TestId =
    | typeof idEditButtonCopyToClipboard
    | typeof idEditButtonOpen
    | typeof idEditButtonOpenSnip
    | typeof idEditOpenSnipButtonNewSnip;

export function getId(id: TestId) {
    return id;
}
