export interface GitHubModelCatalogueEntry {
    id: string;
    name: string;
    publisher: string;
    registry: string;
    summary: string;
    html_url: string;
    version: string;
    capabilities: string[];
    limits: {
        max_input_tokens: number;
        max_output_tokens: number;
    };
    rate_limit_tier: string;
    supported_input_modalities: string[];
    supported_output_modalities: string[];
    tags: string[];
}

/**
 * Does NOT work. But why?
 * https://docs.github.com/en/rest/models/catalog?apiVersion=2022-11-28
 */
export async function getGithubModelCatalog(token: string): Promise<GitHubModelCatalogueEntry[] | undefined> {
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

/**
 * Call inference on a model
 * https://docs.github.com/en/rest/models/inference?apiVersion=2022-11-28
 * @param token GitHub Personal Access Token
 * @returns
 */
export async function getGithubModelInference(token: string) {
    if (token.length === 0) {
        throw new Error("GitHub token is required to access the model catalog.");
    }
    const url = "https://models.github.ai/inference/chat/completions";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Accept: "application/vnd.github+json",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: `Bearer ${token}`,
            ["X-GitHub-Api-Version"]: "2022-11-28",

            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "openai/gpt-4.1",
            messages: [{ role: "user", content: "What is the capital of France?" }],
        }),
    });

    if (response.status === 200) {
        // Response
        const text = await response.text();

        const result = JSON.parse(text);
        return JSON.stringify(result);
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
