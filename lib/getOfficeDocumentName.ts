type OfficeDocumentContext = {
    context?: {
        document?: {
            url?: string;
        };
    };
};

/**
 * Gets the name of the current Office document.
 * If the document is unsaved or the name cannot be determined, a unique name is generated.
 * @beta
 * @returns The name of the current Office document.
 */
export function getOfficeDocumentName(): string {
    const office = (globalThis as typeof globalThis & Record<string, unknown>)["Office"] as
        | OfficeDocumentContext
        | undefined;
    const url = office?.context?.document?.url;

    let name: string | undefined = undefined;

    if (url) {
        try {
            name = decodeURIComponent(url)?.split("/").pop()?.split("\\")?.pop();
        } catch (e) {
            console.error("Failed to parse document name from URL:", e);
        }
    }

    if (name === undefined) {
        name = crypto.randomUUID();
    }

    return name;
}
