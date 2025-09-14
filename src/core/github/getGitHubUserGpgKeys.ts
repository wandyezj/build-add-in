/**
 * Get GPG key for a GitHub user.
 * @returns Gpg key if it exists otherwise undefined.
 */
export async function getGitHubUserGpgKeys(username: string): Promise<string | undefined> {
    // GET https://github.com/USERNAME.gpg

    try {
        const url = `https://github.com/${username}.gpg`;
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            return undefined;
        }

        const text = await response.text();

        const key = text.trim();
        const match =
            key.startsWith("-----BEGIN PGP PUBLIC KEY BLOCK-----") &&
            key.endsWith("-----END PGP PUBLIC KEY BLOCK-----");
        if (match) {
            return key;
        }
        return undefined;
    } catch (error) {
        console.error(`Error fetching GPG key for user ${username}:`, error);
        return undefined;
    }
}
