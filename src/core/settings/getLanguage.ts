import { Language } from "../localize/Language";
import { getSetting } from "../setting";
import { languageMap } from "../localize/languageMap";

/**
 * Get the language setting for the add-in.
 * If the language is set to Default, use the display language of the Office application.
 * If the display language is not available, default to English.
 * @returns The language setting for the add-in.
 */
export function getLanguage(): Exclude<Language, Language.Default> {
    const language = getSetting("language");

    if (language === Language.Default) {
        const displayLanguage = Office.context.displayLanguage;
        console.log(`Display Language: ${displayLanguage}`);

        // Only look at the first part of the language code.
        const lookupLanguage = displayLanguage.split("-")[0];

        // Check if the language is in the map.
        const language = languageMap.get(lookupLanguage);
        if (language) {
            console.log(`Language: ${language}`);
            return language;
        }

        // Default to English if not found.
        console.log(`Display Language ${displayLanguage} Not Available, default to English`);
        return Language.English;
    }

    return language as Exclude<Language, Language.Default>;
}
