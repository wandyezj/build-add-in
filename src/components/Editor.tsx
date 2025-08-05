import React, { useEffect, useRef } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { SnipWithSource } from "../core/Snip";
import { updateMonacoLibs } from "../core/updateMonacoLibs";
import { makeStyles } from "@fluentui/react-components";
import { Theme } from "../core/settings/Theme";
import { getTheme } from "../core/settings/getTheme";

// cspell:ignore tabster

const useStyles = makeStyles({
    editor: {
        width: "100%",
        height: "90vh",
    },
});

let editor: monaco.editor.IStandaloneCodeEditor;

function ignoreCtrlS(element: HTMLElement) {
    // Add a keyboard listener to intercept save key combo "ctrl+s"
    // It's a habit to hit ctrl+s to save.
    // Snips are automatically saved.
    // We don't want to save the page.
    element.addEventListener(
        "keydown",
        (event) => {
            if (event.ctrlKey && event.code === "KeyS") {
                event.preventDefault();
            }
        },
        false
    );
}

function getMonacoEditorTheme() {
    const theme = getTheme();
    switch (theme) {
        case Theme.Dark:
            return "vs-dark";
        case Theme.Light:
            return "vs";
    }
}

export function Editor({
    fileId,
    snip,
    updateSnip,
}: {
    fileId: string;
    snip: SnipWithSource;
    updateSnip: (snip: SnipWithSource) => void;
}) {
    const styles = useStyles();
    console.log(`editor ${fileId}`);

    /**
     * div container for the editor
     */
    const container = useRef<HTMLDivElement>(null);

    function setupEditor() {
        if (editor) {
            // Capture Tab keys in editor
            // Verify source is the monaco editor
            // Stop propagating event
            // Redirect tab to monaco editor
            document.addEventListener("keydown", (e) => {
                if (e.target) {
                    const t = e.target as HTMLTextAreaElement;
                    if (t.className.includes("monaco-mouse-cursor-text")) {
                        if (e.key === "Tab") {
                            e.stopImmediatePropagation();
                            e.stopPropagation();
                            e.preventDefault();
                            t.focus();
                            editor.trigger("keyboard", "tab", null);
                        }
                    }
                }
            });

            const theme = getMonacoEditorTheme();
            monaco.editor.setTheme(theme);

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
                    console.log(`update snip file content ${snip.id} ${id} ${fileId}`);
                    snip.files[fileId].content = editor.getValue();
                    updateSnip(snip);
                }
            });
            updateMonacoLibs(snip.files.libraries.content);
        }
    }

    // runs setup once
    useEffect(() => {
        console.log("editor component effect");
        const element = container.current;
        if (element) {
            // Target the editor container element
            // ignore the save key combo "ctrl+s"
            ignoreCtrlS(element);

            if (editor) {
                editor.dispose();
            }
            const file = snip.files[fileId];
            editor = monaco.editor.create(element, {
                value: file.content,
                language: file.language,
                automaticLayout: true,

                // Options
                minimap: { enabled: false },
                renderWhitespace: "all",
                lineNumbers: "on",

                // Tab inserts spaces
                insertSpaces: true,
            });

            setupEditor();
        }
        return () => {
            editor.dispose();
        };
    }, [snip.id]);

    setupEditor();

    // This allows the editor to capture tabs: data-tabster='{"uncontrolled":{}}'
    return <div data-tabster='{"uncontrolled":{}}' className={styles.editor} ref={container}></div>;
}
