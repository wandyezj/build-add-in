// GitHub interaction using a PAT

// Operations:
// read all gist metadata
// create
// read
// update
// delete
// eslint-disable-next-line @typescript-eslint/naming-convention
function getHeaders(pat: string) {
    return {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Accept: "application/vnd.github+json",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${pat}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "X-GitHub-Api-Version": "2022-11-28",
    };
}

export interface GitHubGist {
    id: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    created_at: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    updated_at: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    files: { [key: string]: { raw_url: string; type: "application/json" | string; language: "JSON" | string } };
    public: boolean;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    owner: { login: string; avatar_url: string };
}

// will need to page
// https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28
export async function getGists(personalAccessToken: string) {
    const perPage = 100;
    const url = `https://api.github.com/gists?per_page=${perPage}`;
    const headers = getHeaders(personalAccessToken);

    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`Failed to get gists: ${response.statusText}`);
    }
    const gists = (await response.json()) as GitHubGist[];

    // array of gists
    // description <- description of the gist
    // created_at <- time the gist was created "2021-03-25T23:51:23Z"
    // updated_at
    // files["snip.json"]["raw_url"]
    // public (boolean) <- tell if the file public (true) or private (false)
    // owner["login"] <- owner of the gist
    // owner["avatar_url"] <- avatar of the owner

    // default only shows last 30 gists (would need to page to see more)
    return gists;
}

export async function getGist(personalAccessToken: string, gistId: string) {
    const url = `https://api.github.com/gists/${gistId}`;
    const headers = getHeaders(personalAccessToken);

    const response = await fetch(url, { headers });
    const o = (await response.json()) as GitHubGist;
    // TODO: verify
    // TODO: Handle error if not found
    return o;
}

export async function createGist(
    personalAccessToken: string,
    body: { public: boolean; description: string; files: { [key: string]: { content: string } } }
) {
    const url = "https://api.github.com/gists";
    const headers = getHeaders(personalAccessToken);

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });

    return (await response.json()) as GitHubGist;
}

/**
 * For Fine Grained Permissions:
 * Can use 'Profile' Read and Write.
 * No current fine grain permissions for read-only access.
 * https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens?apiVersion=2022-11-28#user-permissions-for-profile
 */
export async function getUser(personalAccessToken: string) {
    const url = "https://api.github.com/user";
    const headers = getHeaders(personalAccessToken);

    const response = await fetch(url, {
        method: "POST",
        headers,
    });

    return (await response.json()) as GitHubGist;
}
