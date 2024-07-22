import { getSetting } from "./setting";

/**
 * Enable creating a local copy of a gist.
 */
export function enableGists(): boolean {
    const personalAccessToken = getSetting("githubPersonalAccessToken");
    return personalAccessToken !== "";
}
