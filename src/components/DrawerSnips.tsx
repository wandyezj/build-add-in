import React from "react";
import { useState, useEffect } from "react";
import { DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer, Button } from "@fluentui/react-components";
import { Dismiss24Regular, DocumentFolderRegular } from "@fluentui/react-icons";
import { TooltipButton } from "./TooltipButton";
import { SnipListCard } from "./SnipListCard";
import { getAllSnipMetadata, getAllSnips, getSnipById, saveSnip } from "../core/database";
import {
    ExportSnip,
    SnipMetadata,
    SnipWithSource,
    completeSnip,
    isValidExportSnip,
    pruneSnipForExport,
} from "../core/Snip";
import {
    ClipboardRegular,
    ArrowDownloadRegular,
    ArrowUploadRegular,
    AddRegular,
    //DatabaseArrowDownRegular,
    //DatabaseArrowUpRegular,
} from "@fluentui/react-icons";
import { copyTextToClipboard } from "../core/copyTextToClipboard";
import { downloadFileJson } from "../core/downloadFileJson";
import { uploadFileJson } from "../core/uploadFileJson";
import { objectToJson } from "../core/objectToJson";
import { newDefaultSnip } from "../core/newDefaultSnip";
import { getId, idEditButtonOpenSnip, idEditOpenSnipButtonNewSnip } from "./id";

async function getAllSnipJsonText(): Promise<string> {
    const snips = await getAllSnips();
    const prunedSnips = snips.map((snip) => pruneSnipForExport(snip));
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
    // Allow an array of snips or a single snip
    const o = JSON.parse(text) as ExportSnip[] | ExportSnip;

    const snips = Array.isArray(o) ? o : [o];

    const promises = snips.map((snip, index) => {
        const valid = isValidExportSnip(snip);
        if (!valid) {
            console.error(`Invalid snip at index ${index}`);
            return Promise.resolve();
        }
        const fullSnip = completeSnip(snip, { id: `-${index}` });
        return saveSnip(fullSnip);
    });
    return Promise.all(promises);
}

async function addNewDefaultSnip() {
    const newSnip = newDefaultSnip();
    return saveSnip(newSnip);
}

async function getAllLocalSnips(): Promise<SnipMetadata[]> {
    const snips = await getAllSnipMetadata();
    // display in last modified order
    snips.sort((a, b) => b.modified - a.modified);
    return snips;
}

export function ButtonOpen({ openSnip }: { openSnip: (snip: SnipWithSource) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TooltipButton
                id={idEditButtonOpenSnip}
                tip="Local Snips"
                icon={<DocumentFolderRegular />}
                onClick={() => setIsOpen(true)}
            />
            <DrawerSnips openSnip={openSnip} isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
}

/**
 * Enable opening a snip from a list of available snips.
 */
export function DrawerSnips({
    openSnip,
    isOpen,
    setIsOpen,
}: {
    openSnip: (snip: SnipWithSource) => void;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
                openSnip({ ...snip, source: "local" });
            }
        });
    };

    return (
        <>
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
                    <TooltipButton
                        id={getId(idEditOpenSnipButtonNewSnip)}
                        tip="New Snip"
                        icon={<AddRegular />}
                        onClick={() => {
                            addNewDefaultSnip().then(() => {
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
        </>
    );
}
