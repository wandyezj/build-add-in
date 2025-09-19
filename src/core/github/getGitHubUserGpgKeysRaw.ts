export interface GitHubGpgKey {
    raw_key: string;
}

export async function getGitHubUserGpgKeysRaw(username: string): Promise<string[] | undefined> {
    // GET https://api.github.com/users/USERNAME/gpg_keys

    if (!username || username.trim().length === 0) {
        console.error("Invalid GitHub username provided.");
        return undefined;
    }

    const response = await fetch(`https://api.github.com/users/${username}/gpg_keys`);

    if (!response.ok) {
        console.error(`Error fetching GPG keys for user ${username}:`, response.statusText);
        return undefined;
    }

    const gpgKeys = (await response.json()) as GitHubGpgKey[];
    const keys = gpgKeys
        .map((key) => key.raw_key)
        .map((key) => key.trim())
        .filter(
            (key) =>
                key.startsWith("-----BEGIN PGP PUBLIC KEY BLOCK-----") &&
                key.endsWith("-----END PGP PUBLIC KEY BLOCK-----")
        );

    if (keys.length === 0) {
        return undefined;
    }

    return keys;
}
const response = await fetch("https://api.github.com/users/wandyezj/gpg_keys");
