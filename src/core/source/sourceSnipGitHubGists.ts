import { GenericItemSource } from "./GenericItemSource";
import { getSetting } from "../setting";
import { getExportSnipFromExportJson, isValidSnipExportJson, pruneSnipToSnipMetadata } from "../Snip";
import { getGist, getGists, GitHubGist } from "./github/github";
import { getSingleGistFileUrl } from "../util/loadGistText";
import { loadUrlText } from "../util/loadUrlText";
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
    getItemFromGist: (id: string, gist: GitHubGist, data: string) => Item | undefined;
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
        const rawUrl = getSingleGistFileUrl(gist);
        const text = await loadUrlText(rawUrl);
        const item = getItemFromGist(id, gist, text);
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

const githubSnipStorageFileName = "snip.json";
const personalAccessToken = getSetting("githubPersonalAccessToken");

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
    getItemFromGist: (id, gist: GitHubGist, data: string) => {
        const exportItem = getExportSnipFromExportJson(data);
        if (exportItem === undefined) {
            return undefined;
        }
        const item = {
            id,
            modified: Date.parse(gist.updated_at),
            ...exportItem,
        };
        return item;
    },
});
