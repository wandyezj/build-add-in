import React, { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { Input, Toolbar, ToolbarButton, Tooltip } from "@fluentui/react-components";
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

export function PageEditor() {
    return (
        <>
            <Toolbar>
                
            <Input aria-label="Snip Name" value="Snip Name"/>
                <TooltipButton tip="Run" icon={<PlayRegular />} />
                {/* */}
                <TooltipButton tip="Copy to clipboard" icon={<ClipboardRegular />} />

                <TooltipButton tip="Import" icon={<ArrowDownloadRegular />} />
                <TooltipButton tip="New" icon={<AddRegular />} />
                <TooltipButton tip="Samples" icon={<BookDefault28Regular />} />
                <TooltipButton tip="My Snips" icon={<DocumentFolderRegular />} />
                <TooltipButton tip="Delete" icon={<DeleteRegular />} />
                <TooltipButton tip="Settings" icon={<SettingsRegular />} />
            </Toolbar>
            

            <Editor />
        </>
    );
}

export function TooltipButton({ tip, icon }: { tip: string; icon: React.JSX.Element }) {
    return (
        <Tooltip content={tip} relationship="label">
            <ToolbarButton aria-label={tip} appearance="primary" icon={icon} />
        </Tooltip>
    );
}

export function Editor() {
    const divEl = useRef<HTMLDivElement>(null);
    let editor: monaco.editor.IStandaloneCodeEditor;
    useEffect(() => {
        if (divEl.current) {
            editor = monaco.editor.create(divEl.current, {
                value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n"),
                language: "typescript",
            });
        }
        return () => {
            editor.dispose();
        };
    }, []);
    return <div className="Editor" ref={divEl}></div>;
}
