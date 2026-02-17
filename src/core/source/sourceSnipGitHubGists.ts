import { GenericItemSource } from "./GenericItemSource";
import { getSetting } from "../setting";
import { ExportSnip, getExportSnipFromExportJson, getExportSnipFromExportYaml, pruneSnipToSnipMetadata } from "../Snip";
import { getGist, getGists, GitHubGist } from "./github/github";

/**
 * Use specific GitHub accounts gist storage to store snips.
 * Get a source to manage a collection of github gists.
 */
export function getSourceGithubGists<Item extends { id: string }, ItemMetadata extends { id: string }>(parameters: {
    /**
     * Personal access token for the GitHub API to access Gists.
     */
    personalAccessToken: string;

    /**
     * Prune a GitHub gist to only the required metadata.
     */
    pruneGitHubGistToItemMetadata: (item: GitHubGist) => Promise<ItemMetadata | undefined>;
    getItemFromGist: (id: string, gist: GitHubGist) => Promise<Item | undefined>;
}): GenericItemSource<Item, ItemMetadata> {
    const { personalAccessToken, pruneGitHubGistToItemMetadata, getItemFromGist } = parameters;

    async function getAllItemMetadata() {
        // Get all gists for user
        // Filter gists to only include those that are relevant
        // Prune gists to only required metadata
        const gistMetadata = await getGists(personalAccessToken);
        const pruned = await Promise.all(gistMetadata.map(pruneGitHubGistToItemMetadata));
        const metadata = pruned.filter((item) => item !== undefined) as ItemMetadata[];
        return metadata;
    }

    async function saveItem(item: Item) {
        // need to determine if this is an update or create.
        console.error(`Saving item ${item.id}`);
        return item;
        //throw new Error("Not implemented");
    }

    async function getItemById(id: string) {
        const gist = await getGist(personalAccessToken, id);
        const item = await getItemFromGist(id, gist);
        return item;
    }

    async function deleteItemById(id: string) {
        // Delete gist
        console.log(`Deleting item by id ${id}`);
        throw new Error("Not implemented");
    }

    return {
        getAllItemMetadata,
        saveItem,
        getItemById,
        deleteItemById,
    };
}

// Really should be gist id to metadata?

const githubSnipStorageFileNameJson = "snip.json";
const githubSnipStorageFileNameYaml = "snip.yaml";
const personalAccessToken = getSetting("githubPersonalAccessToken");

async function getExportSnipFromGitHubGistJson(gist: GitHubGist): Promise<ExportSnip | undefined> {
    const snipFile = gist.files[githubSnipStorageFileNameJson];
    if (snipFile === undefined) {
        return undefined;
    }

    const validFileType = snipFile.language === "JSON" && snipFile.type === "application/json";
    if (!validFileType) {
        return undefined;
    }

    // Valid format?
    const url = snipFile.raw_url;

    const response = await fetch(url);
    const text = await response.text();

    const snip = getExportSnipFromExportJson(text);

    // undefined if invalid
    return snip;
}

async function getExportSnipFromGitHubGistYaml(gist: GitHubGist): Promise<ExportSnip | undefined> {
    const snipFile = gist.files[githubSnipStorageFileNameYaml];
    if (snipFile === undefined) {
        return undefined;
    }

    console.log(gist.id, "yaml file", snipFile.raw_url);

    const validFileType = snipFile.language === "YAML" && snipFile.type === "text/x-yaml";
    if (!validFileType) {
        return undefined;
    }

    // Get Yaml file content
    const url = snipFile.raw_url;
    const response = await fetch(url);
    const text = await response.text();

    const snip = getExportSnipFromExportYaml(text);
    return snip;
}

async function getExportSnipFromGitHubGist(gist: GitHubGist): Promise<ExportSnip | undefined> {
    // Support both JSON and YAML snips

    let snip: ExportSnip | undefined;
    console.log(gist.id);

    function errorHandler(e: Error) {
        // This shouldn't happen.
        // Log the error but continue trying other formats.
        console.error(`Error getting snip from GitHub Gist: ${e}`);
        return undefined;
    }

    // try JSON
    snip = await getExportSnipFromGitHubGistJson(gist).catch(errorHandler);
    if (snip !== undefined) {
        console.log(gist.id, snip.name, "json");
        return snip;
    }

    // try YAML
    snip = await getExportSnipFromGitHubGistYaml(gist).catch(errorHandler);
    if (snip !== undefined) {
        console.log(gist.id, snip.name, "yaml");
        return snip;
    }

    // No valid snip found
    return undefined;
}

export const sourceSnipGitHub = getSourceGithubGists({
    personalAccessToken,
    pruneGitHubGistToItemMetadata: async (gist: GitHubGist) => {
        // Is Target Gist?
        const snip = await getExportSnipFromGitHubGist(gist);
        if (snip === undefined) {
            return undefined;
        }

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { id, updated_at } = gist;
        const modified = new Date(updated_at).getTime();

        const metadata = pruneSnipToSnipMetadata({ ...snip, id, modified });
        return metadata;
    },
    getItemFromGist: async (id, gist: GitHubGist) => {
        const exportItem = await getExportSnipFromGitHubGist(gist);

        if (exportItem === undefined) {
            // This can happen if the Gist was modified.
            console.warn(`No export snip found in GitHub Gist with id ${id}`);
            return undefined;
        }

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { updated_at } = gist;
        const modified = Date.parse(updated_at);

        const item = {
            id,
            modified,
            ...exportItem,
        };
        return item;
    },
});
