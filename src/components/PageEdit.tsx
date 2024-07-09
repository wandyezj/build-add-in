import React from "react";
import { useState, useEffect } from "react";

import { Badge, Input, Tab, TabList, Toolbar, Tooltip } from "@fluentui/react-components";
import {
    // ArrowDownloadRegular,
    PlayRegular,
    ClipboardRegular,
    DeleteRegular,
    // BookDefault28Regular,
    DocumentRegular,
    DocumentFolderRegular,
    // SettingsRegular,
} from "@fluentui/react-icons";
import { SnipSource, SnipWithSource, completeSnip, getExportSnipFromExportJson, getSnipExportJson } from "../core/Snip";
import { saveCurrentSnipReference, saveCurrentSnipToRun } from "../core/storage";
import { TooltipButton } from "./TooltipButton";
import { updateMonacoLibs } from "../core/updateMonacoLibs";
import { Editor } from "./Editor";
import { ButtonImport } from "./ButtonImport";
import { deleteSnipById, saveSnip } from "../core/snipStorage";
import { newDefaultSnip } from "../core/newDefaultSnip";
import { copyTextToClipboard } from "../core/copyTextToClipboard";
import { LogTag, log } from "../core/log";
import { ButtonEmbedCopy } from "./ButtonEmbedCopy";
import { ButtonOpenMenu } from "./ButtonOpenMenu";
import { embedEnabled } from "../core/embedEnabled";
import { idEditButtonCopyToClipboard } from "./id";
import { getSetting } from "../core/setting";

function buttonRun() {
    window.location.href = "./run.html#back";
}

export function PageEdit({ initialSnip }: { initialSnip: SnipWithSource }) {
    console.log("render PageEditor ");
    const [fileId, setFileId] = useState("typescript");
    const [snip, setSnip] = useState(initialSnip);

    useEffect(() => {
        setupSnip(snip);
    });

    // TODO: make this more precise in terms of what is updated instead of the entire snip
    const updateSnip = (updatedSnip: SnipWithSource) => {
        console.log(`Update snip\t${updatedSnip.source}\t${updatedSnip.id}\t${updatedSnip.name}`);
        // update last modified
        updatedSnip.modified = Date.now();
        saveSnip(updatedSnip);
        setupSnip(updatedSnip);
    };

    const openSnip = (openSnip: SnipWithSource) => {
        console.log(`open snip\t${openSnip.id}\t${openSnip.name}`);
        setupSnip(openSnip);
    };

    const setupSnip = (setupSnip: SnipWithSource) => {
        saveCurrentSnipReference(setupSnip);
        saveCurrentSnipToRun(setupSnip);

        // IntelliSense
        const currentLibrary = setupSnip.files.libraries.content;
        const newLibrary = setupSnip.files.libraries.content;
        if (currentLibrary !== newLibrary) {
            updateMonacoLibs(newLibrary);
        }
        setSnip(setupSnip);
    };

    const setImport = (value: string) => {
        console.log("Import snip");
        console.log(value);
        const newSnip = getExportSnipFromExportJson(value);
        console.log(newSnip);
        if (newSnip) {
            const complete = completeSnip(newSnip);
            const source = "local";
            updateSnip({ ...complete, source });
        } else {
            console.error("import failed - invalid snip");
        }
    };

    /**
     * Copy the current snip to the clipboard
     */
    function buttonCopySnipToClipboard() {
        log(LogTag.ButtonCopy, "button - copy to clipboard");
        const text = getSnipExportJson(snip);
        copyTextToClipboard(text);
    }

    /**
     * Delete the current snip, replace it with the default snip
     */
    function buttonDeleteSnip() {
        log(LogTag.ButtonDelete, "button - delete");
        const previousId = snip.id;
        const previousSource = snip.source;
        const previousReference = { id: previousId, source: previousSource };
        const newSnip = newDefaultSnip();
        // open the new snip but don't save it until it is edited.
        // note: update saves, which makes it hard to delete snips since each would be replaced by an update
        openSnip({ ...newSnip, source: "local" });
        deleteSnipById(previousReference);
    }

    return (
        <>
            <Toolbar size="medium" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                <ButtonOpenMenu openSnip={openSnip}></ButtonOpenMenu>
                <Tooltip content={snip.name} relationship="label">
                    <Input
                        aria-label="Snip Name"
                        type="text"
                        value={snip.name}
                        onChange={(_, { value }) => {
                            console.log(`update snip ${snip.id} name ${value}`);
                            updateSnip({ ...snip, name: value });
                        }}
                    />
                </Tooltip>

                {getSetting("enableEditRun") ? (
                    <TooltipButton tip="Run" icon={<PlayRegular />} onClick={buttonRun} />
                ) : (
                    <></>
                )}

                <TooltipButton
                    testId={idEditButtonCopyToClipboard}
                    tip="Copy to clipboard"
                    icon={<ClipboardRegular />}
                    onClick={buttonCopySnipToClipboard}
                />

                <ButtonImport setImport={setImport} />
                {embedEnabled() ? <ButtonEmbedCopy snip={snip} /> : <></>}
                {/*
                <TooltipButton tip="Settings" icon={<SettingsRegular />} />
                */}
                <TooltipButton tip="Delete" icon={<DeleteRegular />} onClick={buttonDeleteSnip} />

                {/** Label */}
                {getSourceBadge(snip)}
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

function getSourceBadge(snip: SnipWithSource) {
    const iconLocal = <DocumentFolderRegular />;
    const iconEmbed = <DocumentRegular />;

    function getIconForSource(source: SnipSource) {
        switch (source) {
            case "local":
                return iconLocal;
            case "embed":
                return iconEmbed;
            default:
                console.log("Unknown Source");
                return iconLocal;
        }
    }
    const source = snip.source;
    return (
        <Tooltip content="Snip source" relationship="description">
            <Badge size="large" color="informative" icon={getIconForSource(source)}>
                {source}
            </Badge>
        </Tooltip>
    );
}
