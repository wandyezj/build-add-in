import { getSetting } from "../setting";
import { Theme } from "./Theme";

/**
 * Get the theme setting for the add-in.
 * Default is Light.
 */
export function getTheme(): Exclude<Theme, Theme.Default> {
    const theme = getSetting("theme");

    if (theme === Theme.Default) {
        return Theme.Light;
    }

    return theme;
}
