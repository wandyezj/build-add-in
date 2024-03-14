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
                automaticLayout: true,
            });
            setupEditor();
        }
        return () => {
            editor.dispose();
        };
    }, []);

    setupEditor();

    return <div className={styles.editor} ref={container}></div>;
}
