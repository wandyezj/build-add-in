import React, { useEffect } from "react";
import { useState } from "react";
import { DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer, Button } from "@fluentui/react-components";
import { Dismiss24Regular, DocumentFolderRegular } from "@fluentui/react-icons";
import { TooltipButton } from "./TooltipButton";
import { SnipListCard } from "./SnipListCard";
import { getAllSnipMetadata, getAllSnips, getSnipById, saveSnip } from "../core/database";
import { PrunedSnip, Snip, SnipMetadata, completeSnip, pruneSnipJson } from "../core/Snip";
import {
    ClipboardRegular,
    ArrowDownloadRegular,
    ArrowUploadRegular,
    //DatabaseArrowDownRegular,
    //DatabaseArrowUpRegular,
} from "@fluentui/react-icons";
import { copyTextToClipboard } from "../core/copyTextToClipboard";
import { downloadFileJson, uploadFileJson } from "../core/downloadFile";
import { objectToJson } from "../core/objectToJson";

async function getAllSnipJsonText(): Promise<string> {
    const snips = await getAllSnips();
    const prunedSnips = snips.map((snip) => pruneSnipJson(snip));
    const snipsJsonText = objectToJson(prunedSnips);
    return snipsJsonText;
}

/**
 * Copy all local snips to the clipboard.
 */
async function copyAllToClipboard() {
    const text = await getAllSnipJsonText();
    copyTextToClipboard(text);
}

async function downloadAllToFile() {
    const text = await getAllSnipJsonText();
    downloadFileJson(text, "snips.json");
}

async function uploadMultipleFromFile() {
    const text = await uploadFileJson();

    // put all snips into the database
    const snips = JSON.parse(text) as PrunedSnip[];
    const promises = snips.map((snip, index) => {
        const fullSnip = completeSnip(snip, { id: `-${index}` });
        return saveSnip(fullSnip);
    });
    return Promise.all(promises);
}

async function getAllLocalSnips(): Promise<SnipMetadata[]> {
    const snips = await getAllSnipMetadata();
    // display in last modified order
    snips.sort((a, b) => b.modified - a.modified);
    return snips;
}

/**
 * Enable opening a snip from a list of available snips.
 */
export function OpenButton({ openSnip }: { openSnip: (snip: Snip) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const [localSnips, setLocalSnips] = useState([] as SnipMetadata[]);

    function refreshLocalSnips() {
        getAllLocalSnips().then((snips) => {
            setLocalSnips(snips);
        });
    }

    useEffect(() => {
        refreshLocalSnips();
    }, [isOpen]);

    const clickCard = (id: string) => {
        console.log(`clicked card ${id}`);
        setIsOpen(false);
        getSnipById(id).then((snip) => {
            // TODO: what if snip is undefined?
            if (snip) {
                openSnip(snip);
            }
        });
    };

    return (
        <div>
            <OverlayDrawer open={isOpen} onOpenChange={(_, { open }) => setIsOpen(open)}>
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={
                            <Button
                                appearance="subtle"
                                aria-label="Close"
                                icon={<Dismiss24Regular />}
                                onClick={() => setIsOpen(false)}
                            />
                        }
                    >
                        Local Snips
                    </DrawerHeaderTitle>
                </DrawerHeader>

                <DrawerBody>
                    {/*
                        TODO: Really want these buttons to act on selected snips, not all snips.
                        Need the ability to easily select all.
                        */}
                    <TooltipButton
                        tip="Copy All Snips To Clipboard"
                        icon={<ClipboardRegular />}
                        onClick={copyAllToClipboard}
                    />
                    <TooltipButton
                        tip="Download All Snips"
                        icon={<ArrowDownloadRegular />}
                        onClick={downloadAllToFile}
                    />
                    <TooltipButton
                        tip="Upload Snips"
                        icon={<ArrowUploadRegular />}
                        onClick={() => {
                            uploadMultipleFromFile().then(() => {
                                refreshLocalSnips();
                            });
                        }}
                    />

                    {localSnips.map(({ id, name, modified }) => (
                        <SnipListCard
                            key={id}
                            id={id}
                            title={name}
                            modified={modified}
                            onClick={() => {
                                clickCard(id);
                            }}
                        />
                    ))}
                </DrawerBody>
            </OverlayDrawer>

            <TooltipButton tip="Open Snip" icon={<DocumentFolderRegular />} onClick={() => setIsOpen(true)} />
        </div>
    );
}
