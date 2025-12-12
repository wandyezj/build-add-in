import { isValidExportSnip, isValidSnipExportJson, Snip } from "../core/Snip";
import { loadGistText } from "../core/util/loadGistText";
import { loadUrlText } from "../core/util/loadUrlText";
import { getSnipExportJson } from "./getSnipExport";
import { objectFromYaml } from "./util/objectFromYaml";

function isPossibleUrl(value: string) {
    const text = value.trim();
    // Does it look like a url?
    const possible = !text.includes("\n") && (text.startsWith("http://") || text.startsWith("https://"));
    return possible;
}

function isPossibleGistUrl(value: string) {
    const possible = isPossibleUrl(value) && value.startsWith("https://gist.github.com/");
    return possible;
}

function isPossibleGistId(value: string) {
    // A gist id is a 32 character hex string.
    // This is a very basic check.
    const text = value.trim();
    const possible = /^[a-f0-9]{32}$/.test(text);
    return possible;
}

async function loadGistId(value: string) {
    const gistUrl = `https://gist.github.com/${value}`;
    const text = await loadGistText(gistUrl);
    return text;
}

/**
 * @param value YAML string to parse
 * @returns export snip json string if the value is valid, otherwise undefined
 */
function getSnipExportJsonTextFromExportYaml(value: string): string | undefined {
    try {
        const snip = objectFromYaml<Snip>(value);
        const valid = isValidExportSnip(snip);
        if (valid) {
            const content = getSnipExportJson(snip);
            return content;
        }
    } catch (e) {
        console.error("Error parsing YAML", e);
    }
    return undefined;
}

/**
 * Value can be:
 * - text - JSON snip
 * - url - to a JSON snip
 * - gist - GitHub gist url with a single file containing the JSON snip
 * - gist id - a 32 character hex string that is the gist id
 * @param value
 * @returns the snip text or undefined
 */
export async function getImportSnip(value: string): Promise<string | undefined> {
    // Import - text
    let content = value;

    try {
        const url = value.trim();
        if (isPossibleGistUrl(value)) {
            // Import - gist
            const text = await loadGistText(url);
            content = text;
        } else if (isPossibleUrl(value)) {
            // Import - url
            const text = await loadUrlText(url);
            content = text;
        } else if (isPossibleGistId(value)) {
            // Import - gist id
            const text = await loadGistId(value);
            content = text;
        }
    } catch (e) {
        console.error(e);
    }

    // Is this a valid import json snip?
    const valid = isValidSnipExportJson(content);
    if (valid) {
        return content;
    }

    // Is this a valid export yaml snip?
    const json = getSnipExportJsonTextFromExportYaml(content);
    if (json !== undefined) {
        // Valid YAML snip - return the export json equivalent.
        return json;
    }

    return undefined;
}
