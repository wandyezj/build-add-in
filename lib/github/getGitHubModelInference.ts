import { getGitHubPersonalAccessToken } from "../settings";
import type { GitHubModelInferenceParameters } from "./GitHubModelInferenceParameters";
import type { GitHubModelInferenceResponse } from "./GitHubModelInferenceResponse";
/**
 * Run inference with a model
 * https://docs.github.com/en/rest/models/inference
 * @param options.token GitHub Personal Access Token with models: read scope
 * @returns the response from the GitHub model inference API, or undefined if the request was unsuccessful.
 *
 * @beta
 */
export async function getGitHubModelInference(
    inference: GitHubModelInferenceParameters,
    options?: { token: string }
): Promise<GitHubModelInferenceResponse | undefined> {
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

        const result = JSON.parse(text) as GitHubModelInferenceResponse;
        return result;
    }

    if (response.status === 404) {
        return undefined;
    }

    if (!response.ok) {
        console.error("Error getting model inference", response.statusText);
    }

    return undefined;
}
