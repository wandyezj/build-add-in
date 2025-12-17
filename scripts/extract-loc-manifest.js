// Extract localization strings from the manifest and write them to a file.

const fs = require("fs");
const path = require("path");

const parameters = process.argv.slice(2);

if (parameters.length !== 2) {
    console.log("usage: [manifest.json] [output directory relative to root]");
    process.exit(0);
}

const [manifestPath, outputDirectoryRelative] = parameters;

// https://learn.microsoft.com/en-us/microsoftteams/platform/resources/schema/localization-schema

const manifestText = fs.readFileSync(manifestPath, "utf8");

/**
 * @type {{localizationInfo: {defaultLanguageTag: string;}}}
 */
const manifest = JSON.parse(manifestText);

const root = path.resolve(__dirname, "..");
console.log(root);
const outputDirectory = path.join(root, outputDirectoryRelative);

// Extract localization strings from the manifest.

/**
 * Search for all matching paths in the searchObject given the searchPath.
 * search Path has the format
 * a.b
 * a.b[n]
 *
 * '.' means look for the property in the object
 * '[n]' means search through each array element.
 *
 * @param {string} searchPath
 * @param {unknown} searchObject
 * @param {string} currentPath
 * @returns {Record<string, string>} - key is path, value is string
 */
function doSearch(searchPath, searchObject, currentPath = "") {
    const results = {};

    if (searchObject === null || searchObject === undefined) {
        return results;
    }

    // Split searchPath into first.rest
    const dotIndex = searchPath.indexOf(".");
    const first = dotIndex === -1 ? searchPath : searchPath.slice(0, dotIndex);
    const rest = dotIndex === -1 ? "" : searchPath.slice(dotIndex + 1);

    const isArrayWildcard = first.endsWith("[n]");
    const key = isArrayWildcard ? first.slice(0, -3) : first;

    const nextValue = searchObject[key];

    // If no rest, and we’ve reached the target
    if (!rest) {
        if (isArrayWildcard && Array.isArray(nextValue)) {
            nextValue.forEach((val, i) => {
                if (typeof val === "string") {
                    results[`${currentPath ? currentPath + "." : ""}${key}[${i}]`] = val;
                }
            });
        } else if (typeof nextValue === "string") {
            results[currentPath ? `${currentPath}.${key}` : key] = nextValue;
        }
        return results;
    }

    // If array wildcard: recurse each element
    if (isArrayWildcard && Array.isArray(nextValue)) {
        nextValue.forEach((val, i) => {
            const newPath = currentPath ? `${currentPath}.${key}[${i}]` : `${key}[${i}]`;

            Object.assign(results, doSearch(rest, val, newPath));
        });
        return results;
    }

    // Normal property traversal
    if (nextValue !== undefined) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        Object.assign(results, doSearch(rest, nextValue, newPath));
    }

    return results;
}

/**
 * Specific paths to look for strings in the manifest
 */
const localizationPaths = [
    "name.short",
    "name.full",
    "description.short",
    "description.full",
    "extensions[n].ribbons[n].tabs[n].label",
    "extensions[n].ribbons[n].tabs[n].groups[n].label",
    "extensions[n].ribbons[n].tabs[n].groups[n].controls[n].label",
    "extensions[n].ribbons[n].tabs[n].groups[n].controls[n].supertip.title",
    "extensions[n].ribbons[n].tabs[n].groups[n].controls[n].supertip.description",
];

//
let loc = {};

for (const search of localizationPaths) {
    const found = doSearch(search, manifest);
    loc = { ...loc, ...found };
}

// Write the localization strings to a file
const defaultLanguage = manifest.localizationInfo.defaultLanguageTag;

const locFile = {
    ["$schema"]:
        "https://developer.microsoft.com/en-us/json-schemas/teams/v1.17/MicrosoftTeams.Localization.schema.json",
    ...loc,
};

// Write Base Loc file
const locFileName = `${defaultLanguage}.json`;
const locOutputFilePath = path.join(outputDirectory, locFileName);
const locFileContent = JSON.stringify(locFile, null, 4);
fs.writeFileSync(locOutputFilePath, locFileContent);

// Construct the translation file

// iterate through all keys in loc
const translationValues = [];
for (const key in loc) {
    const value = loc[key];
    translationValues.push(value);
}

// remove duplicates from the array
const uniqueTranslationValues = Array.from(new Set(translationValues));
uniqueTranslationValues.sort();

// Create the translation prompt
const localizeDirectory = path.join(root, "localize");
const promptPrefixFilePath = path.join(localizeDirectory, "prompt-prefix.txt");
const promptPrefix = fs.readFileSync(promptPrefixFilePath, "utf8");

const values = uniqueTranslationValues.map((value) => `"${value}"`).join(", ");

const translationPrompt = `${promptPrefix}\n\n${values}`;
const translationPromptFilePath = path.join(localizeDirectory, "translate-prompt-manifest.txt");
fs.writeFileSync(translationPromptFilePath, translationPrompt, "utf8");
