import type { GitHubModelCatalogueEntry } from "./GitHubModelCatalogueEntry";
import catalog from "./github-model-catalog.json";

/**
 * Get the GitHub Model Catalog
 * This is a static catalog of models available on GitHub. The current API to fetch the catalog is not available, so we are using a static JSON file for now.
 * It is used to provide a list of models that can be used for inference.
 * The catalog is updated periodically and may not reflect the latest models available on GitHub.
 * https://docs.github.com/en/rest/models/catalog
 *
 * @beta
 */
export async function getGitHubModelCatalog(): Promise<GitHubModelCatalogueEntry[]> {
    return catalog as GitHubModelCatalogueEntry[];

    // TODO: swap from hard coded catalog to fetching from API once the API is available. See commented out code below.
    // Does not work because API is not currently available.

    // if (token.length === 0) {
    //     throw new Error("GitHub token is required to access the model catalog.");
    // }
    // const url = "https://models.github.ai/catalog/models";
    // const response = await fetch(url, {
    //     method: "GET",
    //     headers: {
    //         // eslint-disable-next-line @typescript-eslint/naming-convention
    //         Accept: "application/vnd.github+json",
    //         // eslint-disable-next-line @typescript-eslint/naming-convention
    //         Authorization: `Bearer ${token}`,
    //     },
    // });
    // if (response.status === 200) {
    //     const text = await response.text();
    //     const user = JSON.parse(text) as GitHubModelCatalogueEntry[];
    //     return user;
    // }
    // if (response.status === 404) {
    //     // User does not exist
    //     return undefined;
    // }
    // if (!response.ok) {
    //     console.error("Error getting model catalogue", response.statusText);
    // }
    // return undefined;
}
