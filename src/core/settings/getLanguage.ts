import { Language } from "../localize/Language";
import { getSetting } from "../setting";
import { languageMap } from "../localize/languageMap";
import { log, LogTag } from "../log";

/**
 * Get the language setting for the add-in.
 * If the language is set to Default, use the display language of the Office application.
 * If the display language is not available, default to English.
 * @returns The language setting for the add-in.
 */
export function getLanguage(): Exclude<Language, Language.Default> {
    const language = getSetting("language");

    if (language === Language.Default) {
        // Office.js is not loaded.
        if (
            typeof Office !== "object" ||
            Office === null ||
            typeof Office.context !== "object" ||
            Office.context === null ||
            typeof Office.context.displayLanguage === "undefined"
        ) {
            // Happens when running outside of Office.
            log(LogTag.Language, "Display Language Not Available, (Office.js is not loaded) default to English");
            return Language.English;
        }

        const displayLanguage = Office.context.displayLanguage;
        log(LogTag.Language, `Display Language: ${displayLanguage}`);
        if (typeof displayLanguage !== "string") {
            // Happens when running outside of Office.
            log(LogTag.Language, "Display Language Not Available, default to English");
            return Language.English;
        }

        // Only look at the first part of the language code.
        const lookupLanguage = displayLanguage.split("-")[0];

        // Check if the language is in the map.
        const language = languageMap.get(lookupLanguage);
        if (language) {
            log(LogTag.Language, `Language: ${language}`);
            return language;
        }

        // Default to English if not found.
        log(LogTag.Language, `Display Language ${displayLanguage} Not Available, default to English`);
        return Language.English;
    }

    return language as Exclude<Language, Language.Default>;
}
