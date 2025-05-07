import { getLanguage } from "../settings/getLanguage";
import { Language } from "./Language";
import strings from "./strings.json";

export function loc(s: string): string {
    const language = getLanguage();
    if (language === Language.English) {
        return s;
    }

    const translations = strings[language];
    if (translations) {
        const index = strings[Language.English].indexOf(s);
        const translation = translations[index];
        if (translation) {
            return translation;
        }
    }

    // Did not find a translation
    return "?";
}
