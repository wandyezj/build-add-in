// Index for library exports

/**
 * Gets the host color associated with the given Office host type.
 * If the host type is not recognized, it returns a default color.
 * @param host Office.HostType
 * @returns string - The color associated with the host type.
 */
export function getHostColor(host: unknown): string {
    const values: [string, string][] = [
        ["Excel", "green"],
        ["Word", "blue"],
        ["PowerPoint", "orange"],
        ["Outlook", "deepskyblue"],
    ];
    const hostToColor = new Map<string, string>(values);

    const color = hostToColor.get(host as string) || "purple";
    return color;
}
