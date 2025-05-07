import { Language } from "../localize/Language";
import { getSetting } from "../setting";

/**
 * Enable the import button on the edit page
 */
export function getLanguage(): Language {
    const language = getSetting("language");
    return language as Language;
}
