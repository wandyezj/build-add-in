import { PrunedSnip, Snip } from "./Snip";
import yaml from "yaml";
import { saveSample } from "./database";
import { SupportedHostName } from "./globals";

type RawPlaylist = RawPlaylistItem[];

/**
 * YAML
 */
interface RawPlaylistItem {
    name: string;
    description: string;
    rawUrl: string;

    // api_set
    // group
}

/**
 * YAML
 */
interface RawSample {
    name: string;
    description: string;
    script: {
        content: string;
        language: string;
    };
    template: {
        content: string;
        language: string;
    };
    style: {
        content: string;
        language: string;
    };
    libraries: string;
}

export interface SampleMetadata {
    id: string;
    name: string;
    tags: string[];
    description: string;

    // api_set
    // group
}

/**
 * List of Samples to display only metadata.
 */
export type SampleList = SampleMetadata[];

export interface SampleBase {
    description: string;
    tags: string[];
}

export interface PrunedSample extends SampleBase, PrunedSnip {}

export interface Sample extends SampleBase, Snip {}

function parseRawPlaylist(data: string): RawPlaylist {
    const items = yaml.parse(data) as RawPlaylist;
    return items;
}

function parseRawSample(data: string): RawSample {
    const rawSample = yaml.parse(data) as RawSample;
    return rawSample;
}

// function getSampleListFromRawPlaylist(playlist: RawPlaylist): SampleList {
//     const sampleList = playlist.map((item) => {
//         const { name, description, rawUrl } = item;
//         const id = rawUrl;
//         return {
//             id,
//             name,
//             description,
//         };
//     });
//     return sampleList;
// }

/**
 * Transform library references.
 * - Remove jquery & core-js
 * - Reference CDN for office.js types
 * - Directly reference unpkg for npm packages
 * @returns transformed libraries
 */
function transformLibraries(data: string): string {
    function getLinkFromPackageReference(packageReference: string): string | undefined {
        const reg = /^(?<packageName>.*)@(?<packageVersion>\d+\.\d+\.\d+)\/(?<packageFile>.*)$/;
        const groups = reg.exec(packageReference)?.groups;
        if (groups === undefined) {
            return packageReference;
        }

        const { packageName, packageVersion, packageFile } = groups;

        return `https://unpkg.com/${packageName}@${packageVersion}/${packageFile}`;
    }

    const cleanLibraries = data
        .split("\n")
        .map((line) => {
            line = line.trim();

            // Empty line
            if (line === "") {
                return "";
            }

            // Comment
            if (line.startsWith("//") || line.startsWith("#")) {
                return line;
            }

            // direct reference
            if (line.startsWith("https://") || line.startsWith("http://")) {
                return line;
            }

            // office.js
            if (line === "@types/office-js") {
                return `https://appsforoffice.microsoft.com/lib/1/hosted/office.d.ts`;
            }

            // Remove packages
            const packageNamesIgnore = ["jquery", "@types/jquery", "core-js", "@types/core-js"];
            const isExcluded = packageNamesIgnore.some((packageName) => line.startsWith(packageName));
            if (isExcluded) {
                return undefined;
            }

            // npm reference
            const link = getLinkFromPackageReference(line);
            return link;
        })
        .filter((line) => line !== undefined) as string[];

    const cleanData = cleanLibraries.join("\n");
    return cleanData;
}

function transformCss(data: string): string {
    const body = `body {
    background-color: white;
}`;
    const clean = `${body}

${data}`;

    return clean;
}

/**
 * Transform TypeScript code.
 * - remove JQuery handlers
 * - Add Office on ready.
 */
function transformTypeScript(data: string): string {
    // remove jquery

    // $("#id").on("click", () => tryCatch(handler));`;
    const jqueryReg = /^\$\("#(?<id>.*)"\)\.on\("click", \(\) => tryCatch\((?<handler>.*)\)\);$/;
    const cleanData = data
        .split("\n")
        .map((line) => {
            const trimLine = line.trim();

            if (trimLine.startsWith("$")) {
                // JQuery
                const match = jqueryReg.exec(trimLine);
                if (match === null) {
                    return line;
                }
                const groups = match?.groups;
                if (groups) {
                    const { id, handler } = groups;
                    return `document.getElementById("${id}").addEventListener("click", () => tryCatch(${handler}));`;
                }
            }

            return line;
        })
        .join("\n");

    const ready = `Office.onReady(() => {
    console.log("Office is ready");
});`;
    const code = `${ready}

${cleanData}
 `;
    return code;
}

function getSampleFromRawSample(rawSample: RawSample, id: string, tags: string[]): PrunedSample | undefined {
    // TODO: transform the sample.
    // Update libraries
    // Update typescript

    const { name, description } = rawSample;

    const typescriptRaw = rawSample?.script?.content;
    const htmlRaw = rawSample?.template?.content;
    const cssRaw = rawSample?.style?.content;
    const librariesRaw = rawSample?.libraries;

    if ([typescriptRaw, htmlRaw, cssRaw, librariesRaw].some((content) => content === undefined)) {
        console.log(`ERROR: Empty content [${rawSample.name}] ${id}`);
        // happens for custom functions
        return undefined;
    }

    const typescriptContent = transformTypeScript(typescriptRaw);
    const htmlContent = htmlRaw;
    const cssContent = transformCss(cssRaw);
    const librariesContent = transformLibraries(librariesRaw);

    const sample: PrunedSample = {
        name,
        description,
        tags,
        files: {
            typescript: {
                content: typescriptContent,
                language: "typescript",
            },
            html: {
                content: htmlContent,
                language: "html",
            },
            css: {
                content: cssContent,
                language: "css",
            },
            libraries: {
                content: librariesContent,
                language: "text",
            },
        },
    };

    return sample;
}

async function readRawPlaylistData(application: SupportedHostName): Promise<string> {
    const url = `https://raw.githubusercontent.com/OfficeDev/office-js-snippets/main/playlists-prod/${application}.yaml`;
    const response = await fetch(url);
    const text = await response.text();
    return text;
}

async function getSampleFromUrl(url: string, tags: string[]): Promise<Sample | undefined> {
    const response = await fetch(url);
    const text = await response.text();
    const rawSample = parseRawSample(text);
    const prunedSample = getSampleFromRawSample(rawSample, url, tags);
    if (prunedSample === undefined) {
        return undefined;
    }

    const sample = {
        ...prunedSample,
        id: url,
        modified: Date.now(),
    };
    return sample;
}

// Take sample snippets on GitHub and transform them for the Build Add-In.
// Sample List
// https://github.com/OfficeDev/office-js-snippets

// Playlists
// https://raw.githubusercontent.com/OfficeDev/office-js-snippets/main/playlists-prod/excel.yaml
// excel, powerpoint, word

/**
 * Load samples into the database.
 */
export async function loadSamplesToDatabase(host: SupportedHostName): Promise<void> {
    console.log("Load Samples To Database - Start");

    // TODO: do for all applications
    const rawPlaylistData = await readRawPlaylistData(host);
    const rawPlaylist = parseRawPlaylist(rawPlaylistData);
    // what data is in the sample list? This should be built out of the database.
    // there is some extra metadata that is useful
    //const sampleList = getSampleListFromRawPlaylist(rawPlaylist);

    const promises = rawPlaylist.map(async (item) => {
        const { rawUrl } = item;
        const sample = await getSampleFromUrl(rawUrl, [host]);
        // Save the sample to the database
        // Can be undefined if there is an issue with the sample
        if (sample) {
            saveSample(sample);
        }
    });
    // What

    await Promise.all(promises);
    console.log("Load Samples To Database - End");
}
