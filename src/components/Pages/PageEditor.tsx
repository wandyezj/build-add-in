import React, { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { Input, Tab, TabList, Toolbar } from "@fluentui/react-components";
import {
    AddRegular,
    ArrowDownloadRegular,
    PlayRegular,
    ClipboardRegular,
    DeleteRegular,
    BookDefault28Regular,
    DocumentFolderRegular,
    SettingsRegular,
} from "@fluentui/react-icons";
import { Snip } from "../../core/Snip";
import { deleteSnip, loadSnip, saveSnip } from "../../core/storage";
import { TooltipButton } from "./TooltipButton";
import { defaultSnip } from "../../core/defaultSnip";
import { parseLibraries } from "../../core/parseLibraries";

export function PageEditor() {
    const [fileId, setFileId] = useState("typescript");

    const [snip, setSnip] = useState(loadSnip() || defaultSnip);

    // TODO: make this more precise in terms of what is updated instead of the entire snip
    const updateSnip = (newSnip: Snip) => {
        const currentLibrary = snip.files.libraries.content;
        const newLibrary = newSnip.files.libraries.content;
        if (currentLibrary !== newLibrary) {
            updateMonacoLibs(newLibrary);
        }
        saveSnip(newSnip);
        setSnip(newSnip);
    };

    /**
     * Copy the current snip to the clipboard
     */
    function buttonCopySnipToClipboard() {
        console.log("button - copy to clipboard");
        navigator.clipboard.writeText(JSON.stringify(snip, null, 4));
    }

    /**
     * Delete the current snip, replace it with the default snip
     */
    function buttonDeleteSnip() {
        console.log("button - delete");
        deleteSnip();
        setSnip(defaultSnip);
    }

    return (
        <>
            <Toolbar>
                <Input
                    aria-label="Snip Name"
                    type="text"
                    value={snip.name}
                    onChange={(_, { value }) => {
                        console.log(`update snip name ${value}`);
                        updateSnip({ ...snip, name: value });
                    }}
                />

                {/* */}
                <TooltipButton
                    tip="Copy to clipboard"
                    icon={<ClipboardRegular />}
                    onClick={buttonCopySnipToClipboard}
                />

                <TooltipButton tip="Import" icon={<ArrowDownloadRegular />} />
                {/*
                <TooltipButton tip="Run" icon={<PlayRegular />} />
                <TooltipButton tip="New" icon={<AddRegular />} />
                <TooltipButton tip="Samples" icon={<BookDefault28Regular />} />
                <TooltipButton tip="My Snips" icon={<DocumentFolderRegular />} /> 
                <TooltipButton tip="Settings" icon={<SettingsRegular />} />
                */}
                <TooltipButton tip="Delete" icon={<DeleteRegular />} onClick={buttonDeleteSnip} />
            </Toolbar>
            <TabList
                defaultSelectedValue="typescript"
                onTabSelect={(_, { value }) => {
                    console.log(`setFileId ${value}`);
                    setFileId(value as string);
                }}
            >
                <Tab value="typescript"> TS </Tab>
                <Tab value="html">HTML</Tab>
                <Tab value="css"> CSS</Tab>
                <Tab value="libraries"> Libraries</Tab>
            </TabList>

            <Editor snip={snip} updateSnip={updateSnip} fileId={fileId} />
        </>
    );
}

let editor: monaco.editor.IStandaloneCodeEditor;

export function Editor({ fileId, snip, updateSnip }: { fileId: string; snip: Snip; updateSnip: (snip: Snip) => void }) {
    console.log(`editor ${fileId}`);

    /**
     * div container for the editor
     */
    const container = useRef<HTMLDivElement>(null);

    function setupEditor() {
        if (editor) {
            editor.getModel()?.dispose();
            const file = snip.files[fileId];
            const model = monaco.editor.createModel(file.content, file.language);
            editor.setModel(model);
            editor.onDidChangeModelContent(() => {
                const id = editor.getModel()?.getLanguageId();
                if (id) {
                    // HACK: fileId is not the same as the language id
                    const idToFileId = new Map<string, string>([
                        ["typescript", "typescript"],
                        ["html", "html"],
                        ["css", "css"],
                        ["plaintext", "libraries"],
                    ]);
                    const fileId = idToFileId.get(id)!;
                    console.log(`update snip file content ${id} ${fileId}`);
                    snip.files[fileId].content = editor.getValue();
                    updateSnip(snip);
                }
            });
            updateMonacoLibs(snip.files.libraries.content);
        }
    }

    // runs setup once
    useEffect(() => {
        console.log("effect");
        if (container.current) {
            const file = snip.files[fileId];
            editor = monaco.editor.create(container.current, {
                value: file.content,
                language: file.language,
            });
            setupEditor();
        }
        return () => {
            editor.dispose();
        };
    }, []);

    setupEditor();

    return <div className="Editor" ref={container}></div>;
}

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
            console.log(`${name} - ${value === undefined ? "?" : "loaded"}`);
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

function updateMonacoLibs(libraries: string) {
    console.log("updateMonacoLibs", libraries);
    const { dts } = parseLibraries(libraries);

    globalCurrentLibraries.sort();
    dts.sort();

    if (globalCurrentLibraries.join("\n") !== dts.join("\n")) {
        globalCurrentLibraries = dts;
        loadCurrentLibraries();
    }
}
