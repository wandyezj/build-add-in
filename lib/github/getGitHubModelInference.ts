import { getGitHubPersonalAccessToken } from "../settings";
import type { GitHubModelInferenceParameters } from "./GitHubModelInferenceParameters";

/**
 * @beta
 * Call inference on a model
 * https://docs.github.com/en/rest/models/inference?apiVersion=2022-11-28
 * @param token GitHub Personal Access Token with models: read scope
 * @returns
 */
export async function getGitHubModelInference(inference: GitHubModelInferenceParameters, options?: { token: string }) {
    const token = options?.token || getGitHubPersonalAccessToken();
    if (!token || token.length === 0) {
        throw new Error("GitHub token is required to access the model catalog.");
    }
    const url = "https://models.github.ai/inference/chat/completions";
    const body = JSON.stringify(inference);
    const response = await fetch(url, {
        method: "POST",
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "Content-Type": "application/json",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Accept: "application/vnd.github+json",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: `Bearer ${token}`,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            ["X-GitHub-Api-Version"]: "2022-11-28",
        },
        body,
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
