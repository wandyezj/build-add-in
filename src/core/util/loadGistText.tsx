import { loadUrlText } from "./loadUrlText";

export async function loadGistText(url: string): Promise<string> {
    const gistId = url.split("/").pop();
    if (!gistId) {
        throw new Error("Invalid gist url");
    }
    const gistApiUrl = `https://api.github.com/gists/${gistId}`;
    const request = await fetch(gistApiUrl);
    const gistJson = await request.json();

    // Find the first files raw url
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const rawUrl = getSingleGistFileUrl(gistJson);

    // load up the gist data
    const text = await loadUrlText(rawUrl);
    return text;
}

export function getSingleGistFileUrl(gistJson: { files: { [key: string]: { raw_url: string } } }): string {
    const files = gistJson["files"];
    const filesData = Object.values(files);
    if (filesData.length !== 1) {
        throw new Error("Gist must have a single file");
    }
    const file = filesData[0];
    const rawUrl = file["raw_url"];
    return rawUrl;
}
