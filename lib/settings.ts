/**
 * Get a setting value by name.
 * @param settingName
 * @returns the current setting value.
 */
function getSetting(settingName: "githubPersonalAccessToken"): string {
    const settingsValue = localStorage.getItem("settings") || "{}";
    let settings: Record<string, string> = {};
    try {
        settings = JSON.parse(settingsValue);
    } catch (e) {
        throw new Error("Failed to parse settings from localStorage.");
    }

    if (
        !(
            typeof settings === "object" &&
            settings !== null &&
            Object.prototype.hasOwnProperty.call(settings, settingName)
        )
    ) {
        throw new Error(`Setting ${settingName} does not exist.`);
    }

    return settings[settingName];
}

/**
 * Get the GitHub Personal Access Token from settings.
 * @returns The GitHub Personal Access Token in settings.
 *
 * @beta
 */
export function getGitHubPersonalAccessToken(): string {
    return getSetting("githubPersonalAccessToken");
}
