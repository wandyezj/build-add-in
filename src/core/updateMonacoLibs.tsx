import * as monaco from "monaco-editor";
import { parseLibraries } from "./parseLibraries";
import { LogTag, log } from "./log";

// Update intellisense for monaco

const globalLibraryCache: Map<string, string> = new Map();

function getLib(lib: string) {
    const value = globalLibraryCache.get(lib);
    if (value === undefined) {
        // Load the library
        globalLibraryCache.set(lib, "");
        fetch(lib)
            .then(async (response) => {
                const value = await response.text();
                globalLibraryCache.set(lib, value);
                loadCurrentLibraries();
            })
            .catch((error) => {
                console.error(`Failed to load library ${lib}`, error);
            });
    }
    return value;
}

let globalCurrentLibraries: string[] = [];

function loadMonacoLibs(libs: string[]) {
    const loadedLibs = libs.map((lib) => {
        return {
            name: lib,
            value: getLib(lib),
        };
    });

    const readyLibs = loadedLibs
        .map(({ name, value }) => {
            // Display a log message for if the library is loaded.
            log(LogTag.LoadMonacoLibs, `${name} - ${value === undefined ? "?" : "loaded"}`);
            return value || "";
        })
        .filter((value) => value !== "");

    const typescriptDefaults = monaco.languages.typescript.typescriptDefaults;
    typescriptDefaults.setExtraLibs([]);
    readyLibs.forEach((lib) => {
        typescriptDefaults.addExtraLib(lib);
    });
}

function loadCurrentLibraries() {
    loadMonacoLibs(globalCurrentLibraries);
}

/**
 * Update the monaco intellisense libraries from links present in the libraries file
 * @param libraries text
 */
export function updateMonacoLibs(libraries: string) {
    log(LogTag.UpdateMonacoLibs, `updateMonacoLibs\n${libraries}`);
    const { dts } = parseLibraries(libraries);

    globalCurrentLibraries.sort();
    dts.sort();

    if (globalCurrentLibraries.join("\n") !== dts.join("\n")) {
        globalCurrentLibraries = dts;
        loadCurrentLibraries();
    }
}
