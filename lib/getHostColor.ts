/**
 * Gets the host color associated with the given Office host type.
 * If the host type is not recognized, it returns a default color.
 * @param host Office.HostType (for example: Excel, Word, PowerPoint, Outlook)
 * @returns The color associated with the host type.
 *
 * @beta
 */
export function getHostColor(host: string | unknown): string {
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
