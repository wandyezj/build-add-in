import React, { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { Snip } from "../core/Snip";
import { updateMonacoLibs } from "../core/updateMonacoLibs";
import { makeStyles } from "@fluentui/react-components";

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

export function Editor({ fileId, snip, updateSnip }: { fileId: string; snip: Snip; updateSnip: (snip: Snip) => void }) {
    const styles = useStyles();
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
        if (container.current) {
            // Target the editor container element
            // ignore the save key combo "ctrl+s"
            ignoreCtrlS(container.current);

            if (editor) {
                editor.dispose();
            }
            const file = snip.files[fileId];
            editor = monaco.editor.create(container.current, {
                value: file.content,
                language: file.language,
                automaticLayout: true,
                minimap: { enabled: false },
            });
            setupEditor();
        }
        return () => {
            editor.dispose();
        };
    }, [snip.id]);

    setupEditor();

    return <div className={styles.editor} ref={container}></div>;
}
