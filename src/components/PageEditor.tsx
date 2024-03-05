import React, { useState } from "react";

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
import { Snip } from "../core/Snip";
import { deleteSnip, loadSnip, saveSnip } from "../core/storage";
import { TooltipButton } from "./TooltipButton";
import { defaultSnip } from "../core/defaultSnip";
import { updateMonacoLibs } from "../core/updateMonacoLibs";
import { Editor } from "./Editor";

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
