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
import { loadSnip, saveSnip } from "../../core/storage";
import { TooltipButton } from "./TooltipButton";
import { defaultSnip } from "../../core/defaultSnip";

export function PageEditor() {
    const [fileId, setFileId] = useState("typescript");
    const [snip, setSnip] = useState(loadSnip() || defaultSnip);

    const updateSnip = (snip: Snip) => {
        saveSnip(snip);
        setSnip(snip);
    };

    function copySnipToClipboard() {
        navigator.clipboard.writeText(JSON.stringify(snip, null, 4));
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
                <TooltipButton tip="Run" icon={<PlayRegular />} />
                {/* */}
                <TooltipButton tip="Copy to clipboard" icon={<ClipboardRegular />} onClick={copySnipToClipboard} />

                <TooltipButton tip="Import" icon={<ArrowDownloadRegular />} />
                <TooltipButton tip="New" icon={<AddRegular />} />
                <TooltipButton tip="Samples" icon={<BookDefault28Regular />} />
                <TooltipButton tip="My Snips" icon={<DocumentFolderRegular />} />
                <TooltipButton tip="Delete" icon={<DeleteRegular />} />
                <TooltipButton tip="Settings" icon={<SettingsRegular />} />
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

    // runs setup once
    useEffect(() => {
        console.log("effect");
        if (container.current) {
            const file = snip.files[fileId];
            editor = monaco.editor.create(container.current, {
                value: file.content,
                language: file.language,
            });
        }
        return () => {
            editor.dispose();
        };
    }, []);

    if (editor) {
        editor.getModel()?.dispose();
        const file = snip.files[fileId];
        const model = monaco.editor.createModel(file.content, file.language);
        editor.setModel(model);
        editor.onDidChangeModelContent(() => {
            const id = editor.getModel()?.getLanguageId();
            if (id) {
                console.log(`update snip file content ${id}`);
                snip.files[id].content = editor.getValue();
                updateSnip(snip);
            }
        });
    }

    return <div className="Editor" ref={container}></div>;
}
