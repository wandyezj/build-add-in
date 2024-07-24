import { GenericItemSource } from "./GenericItemSource";
import { getSetting } from "../setting";
import {
    getExportSnipFromExportJson,
    getSnipFromJson,
    getSnipJson,
    isValidSnipExportJson,
    pruneSnipToSnipMetadata,
} from "../Snip";
import { getGists, GitHubGist } from "./github/github";
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
    getItemJson: (item: Item) => string;
    getItemFromJson: (data: string) => Item | undefined;
}): GenericItemSource<Item, ItemMetadata> {
    const { personalAccessToken, pruneGitHubGistToItemMetadata, getItemJson, getItemFromJson } = parameters;

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

        throw new Error("Not implemented");
        return undefined as unknown as Item;
    }

    async function getItemById(id: string) {
        //const gist = getGist(personalAccessToken, id);
        return undefined;
    }

    async function deleteItemById(id: string) {
        // Delete gist
    }

    return {
        getAllItemMetadata,
        saveItem,
        getItemById,
        deleteItemById,
    };
}

// Really should be gist id to metadata?

const githubSnipStorageFileName = "snip.json";
const personalAccessToken = getSetting("githubPersonalAccessToken");

async function getItemFromId(id: string) {
    return undefined;
}
export const sourceSnipGitHub = getSourceGithubGists({
    personalAccessToken,
    pruneGitHubGistToItemMetadata: async (item) => {
        // Is Target Gist
        const snipFile = item.files[githubSnipStorageFileName];
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
        const valid = isValidSnipExportJson(text);

        if (!valid) {
            return undefined;
        }

        const snip = getExportSnipFromExportJson(text);
        if (snip === undefined) {
            return undefined;
        }

        const id = item.id;
        const modified = new Date(item.updated_at).getTime();
        //snip.id = item.id;
        const metadata = pruneSnipToSnipMetadata({ ...snip, id, modified });
        return metadata;
    },
    getItemJson: getSnipJson,
    getItemFromJson: getSnipFromJson,
});
