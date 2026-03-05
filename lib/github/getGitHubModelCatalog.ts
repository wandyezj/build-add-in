import type { GitHubModelCatalogueEntry } from "./GitHubModelCatalogueEntry";

/**
 * @beta
 * Does NOT work. But why?
 * https://docs.github.com/en/rest/models/catalog?apiVersion=2022-11-28
 */
export async function getGitHubModelCatalog(token: string): Promise<GitHubModelCatalogueEntry[] | undefined> {
    if (token.length === 0) {
        throw new Error("GitHub token is required to access the model catalog.");
    }
    const url = "https://models.github.ai/catalog/models";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Accept: "application/vnd.github+json",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 200) {
        // User exists
        const text = await response.text();

        const user = JSON.parse(text) as GitHubModelCatalogueEntry[];
        return user;
    }

    if (response.status === 404) {
        // User does not exist
        return undefined;
    }

    if (!response.ok) {
        console.error("Error getting model catalogue", response.statusText);
    }

    return undefined;
}
