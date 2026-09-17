declare var Office: any;

/**
 * Gets the name of the current Office document.
 * If the document is unsaved or the name cannot be determined, a unique name is generated.
 * @beta
 * @returns The name of the current Office document.
 */
export function getOfficeDocumentName(): string {
    const url = Office?.context?.document?.url as string;

    let name: string | undefined = undefined;

    if (url) {
        try {
            name = decodeURIComponent(url)?.split("/").pop()?.split("\\")?.pop();
        } catch (e) {
            console.error("Failed to parse document name from URL:", e);
        }
    }

    if (name === undefined) {
        name = "UnsavedDocument" + crypto.randomUUID();
    }

    return name;
}
