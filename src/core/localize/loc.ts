import { getLanguage } from "../settings/getLanguage";
import { Language } from "./Language";
import strings from "./strings.json";

export function loc(s: string): string {
    const language = getLanguage();
    if (language === Language.English) {
        return s;
    }

    const index = strings[Language.English].indexOf(s);

    // Pseudo language is used to find strings that are not translated.
    if (language === Language.Pseudo) {
        if (index === -1) {
            // Not Localized
            return s;
        }
        // Add a question mark to the string to indicate it is translated.
        return `? ${s}`;
    }

    const translations = strings[language];
    if (translations) {
        const translation = translations[index];
        if (translation) {
            return translation;
        }
    }

    // Did not find a translation - use original English.
    return s;
}
