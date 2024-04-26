import React from "react";
import {
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent,
    Button,
} from "@fluentui/react-components";
import { TooltipButton } from "./TooltipButton";
import { ArrowDownloadRegular } from "@fluentui/react-icons";

import { makeStyles, tokens, useId, Label, Textarea } from "@fluentui/react-components";
import { LogTag, log } from "../core/log";
import { isValidSnipExportJson } from "../core/Snip";

const useStyles = makeStyles({
    base: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        marginBottom: tokens.spacingVerticalMNudge,
    },
});

async function loadUrlText(url: string): Promise<string> {
    const request = await fetch(url);
    const text = await request.text();
    return text;
}

async function loadGistText(url: string): Promise<string> {
    const gistId = url.split("/").pop();
    if (!gistId) {
        throw new Error("Invalid gist url");
    }
    const gistApiUrl = `https://api.github.com/gists/${gistId}`;
    const request = await fetch(gistApiUrl);
    const gistJson = await request.json();

    // Find the first files raw url
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const files = gistJson["files"] as { raw_url: string }[];
    const filesData = Object.values(files);
    if (filesData.length !== 1) {
        throw new Error("Gist must have a single file");
    }
    const file = filesData[0];
    const rawUrl = file["raw_url"];

    // load up the gist data
    const text = await loadUrlText(rawUrl);
    return text;
}

function isPossibleUrl(value: string) {
    const text = value.trim();
    // Does it look like a url?
    const possible = !text.includes("\n") && (text.startsWith("http://") || text.startsWith("https://"));
    return possible;
}

function isPossibleGistUrl(value: string) {
    const possible = isPossibleUrl(value) && value.startsWith("https://gist.github.com/");
    return possible;
}

/**
 * Value can be:
 * - text - JSON snip
 * - url - to a JSON snip
 * - gist - GitHub gist url with a single file containing the JSON snip
 * @param value
 * @returns the snip text or undefined
 */
async function getImportSnip(value: string): Promise<string | undefined> {
    // Import - text
    let content = value;

    try {
        const url = value.trim();
        if (isPossibleGistUrl(value)) {
            // Import - gist
            const text = await loadGistText(url);
            content = text;
        } else if (isPossibleUrl(value)) {
            // Import - url
            const text = await loadUrlText(url);
            content = text;
        }
    } catch (e) {
        console.error(e);
    }

    // Is this a valid import snip?
    const valid = isValidSnipExportJson(content);
    if (valid) {
        return content;
    }
    return undefined;
}

export function ButtonImport({ setImport }: { setImport: (value: string) => void }) {
    const textareaId = useId("import-textarea");
    const styles = useStyles();

    async function onClickImport(event: React.FormEvent) {
        event.preventDefault();
        log(LogTag.ButtonImport, "import");
        const value = (document.getElementById(textareaId) as HTMLTextAreaElement).value;
        const snipText = await getImportSnip(value);
        if (snipText) {
            setImport(snipText);
        }
        // otherwise invalid.
    }

    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                <TooltipButton tip="Import" icon={<ArrowDownloadRegular />} />
            </DialogTrigger>
            <DialogSurface>
                <form onSubmit={onClickImport}>
                    <DialogBody>
                        <DialogTitle>Import Snip Json</DialogTitle>
                        <DialogContent>
                            <div className={styles.base}>
                                <Label className={styles.label} htmlFor={textareaId}>
                                    Paste a JSON, gist, or url.
                                </Label>
                                <Textarea id={textareaId} />
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <DialogTrigger disableButtonEnhancement>
                                <Button appearance="secondary">Close</Button>
                            </DialogTrigger>
                            <DialogTrigger disableButtonEnhancement>
                                <Button type="submit" appearance="primary">
                                    Import
                                </Button>
                            </DialogTrigger>
                        </DialogActions>
                    </DialogBody>
                </form>
            </DialogSurface>
        </Dialog>
    );
}
