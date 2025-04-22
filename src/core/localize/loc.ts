import { getLanguage } from "../settings/getLanguage";
import { Language } from "./Language";

export function loc(s: string): string {
    const language = getLanguage();
    if (language === Language.English) {
        return s;
    }

    // Did not find a translation
    return "?";
}
