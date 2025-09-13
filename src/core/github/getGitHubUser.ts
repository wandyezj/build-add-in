export interface GitHubUser {
    avatar_url: string;
    email: string;
}

/**
 * Gets the GitHub user by username.
 * @returns The GitHub user if it exists, otherwise undefined.
 */
export async function getGitHubUser(username: string): Promise<GitHubUser | undefined> {
    if (username.length === 0) {
        return undefined; // No username provided
    }

    const url = `https://api.github.com/users/${username}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/vnd.github.v3+json",
        },
    });

    if (response.status === 200) {
        // User exists
        const text = await response.text();

        const user = JSON.parse(text) as GitHubUser;
        return user;
    }

    if (response.status === 404) {
        // User does not exist
        return undefined;
    }

    if (!response.ok) {
        console.error("Error checking GitHub username:", response.statusText);
    }

    return undefined;
}
