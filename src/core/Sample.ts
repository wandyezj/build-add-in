import { PrunedSnip, Snip } from "./Snip";
import yaml from "yaml";
import { saveSample } from "./database";

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
    description: string;

    // api_set
    // group
}

/**
 * List of Samples to display only metadata.
 */
export type SampleList = SampleMetadata[];

export interface PrunedSample extends PrunedSnip {
    description: string;
}

export interface Sample extends Snip {
    description: string;
}

function parseRawPlaylist(data: string): RawPlaylist {
    const items = yaml.parse(data) as RawPlaylist;
    return items;
}

function parseRawSample(data: string): RawSample {
    const rawSample = yaml.parse(data) as RawSample;
    return rawSample;
}

function getSampleListFromRawPlaylist(playlist: RawPlaylist): SampleList {
    const sampleList = playlist.map((item) => {
        const { name, description, rawUrl } = item;
        const id = rawUrl;
        return {
            id,
            name,
            description,
        };
    });
    return sampleList;
}

function transformLibraries(data: string): string {
    // TODO:
    // remove jquery
    // remove core-js
    // transforms npm references to unpkg references
    return data;
}

function transformTypeScript(data: string): string {
    // TODO: remove jquery
    return data;
}

function getSampleFromRawSample(rawSample: RawSample): PrunedSample {
    // TODO: transform the sample.
    // Update libraries
    // Update typescript

    const { name, description } = rawSample;

    const typescriptContent = transformTypeScript(rawSample.script.content);
    const htmlContent = rawSample.template.content;
    const cssContent = rawSample.style.content;
    const librariesContent = transformLibraries(rawSample.libraries);

    const sample: PrunedSample = {
        name,
        description,
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

async function readRawPlaylistData(application: "word" | "excel" | "powerpoint"): Promise<string> {
    const url = `https://raw.githubusercontent.com/OfficeDev/office-js-snippets/main/playlists-prod/${application}.yaml`;
    const response = await fetch(url);
    const text = await response.text();
    return text;
}

async function getSampleFromUrl(url: string): Promise<Sample> {
    const response = await fetch(url);
    const text = await response.text();
    const rawSample = parseRawSample(text);
    const prunedSample = getSampleFromRawSample(rawSample);

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
export async function loadSamplesToDatabase(): Promise<void> {
    console.log("Load Samples To Database - Start");

    // TODO: do for all applications
    const rawPlaylistData = await readRawPlaylistData("excel");
    const rawPlaylist = parseRawPlaylist(rawPlaylistData);
    // what data is in the sample list? This should be built out of the database.
    // there is some extra metadata that is useful
    //const sampleList = getSampleListFromRawPlaylist(rawPlaylist);

    const promises = rawPlaylist.map(async (item) => {
        const { rawUrl } = item;
        const sample = await getSampleFromUrl(rawUrl);
        saveSample(sample);

        // Save the sample to the database
    });
    // What

    await Promise.all(promises);
    console.log("Load Samples To Database - End");
}
