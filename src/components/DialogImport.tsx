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

import { makeStyles, tokens, useId, Label, Textarea } from "@fluentui/react-components";
import { LogTag, log } from "../core/log";
import { SnipWithSource, completeSnip, getExportSnipFromExportJson, isValidSnipExportJson } from "../core/Snip";
import { saveSnip } from "../core/snipStorage";
import { loadUrlText } from "../core/util/loadUrlText";
import { loadGistText } from "../core/util/loadGistText";
import { loc } from "../core/localize/loc";

const useStyles = makeStyles({
    base: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        marginBottom: tokens.spacingVerticalMNudge,
    },
});

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

async function importSnip(value: string): Promise<SnipWithSource | undefined> {
    console.log("Import snip");
    console.log(value);
    const newSnip = getExportSnipFromExportJson(value);
    console.log(newSnip);
    if (newSnip) {
        // create a new snip with the imported snip
        const complete = completeSnip(newSnip);
        const source = "local";
        complete.modified = Date.now();
        const importSnip: SnipWithSource = { ...complete, source };

        const saved = await saveSnip(importSnip);
        return saved;
    } else {
        console.error("import failed - invalid snip");
    }
    return undefined;
}

export function DialogImport({
    open,
    setOpen,
    openSnip,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    openSnip: (openSnip: SnipWithSource) => void;
}) {
    //const [open, setOpen] = React.useState(open);
    const textareaId = useId("import-textarea");
    const styles = useStyles();

    async function doImport(value: string) {
        const snip = await importSnip(value);
        if (snip) {
            openSnip(snip);
        }
    }

    async function onClickImport(event: React.FormEvent) {
        event.preventDefault();
        log(LogTag.ButtonImport, "import");
        const value = (document.getElementById(textareaId) as HTMLTextAreaElement).value;
        const snipText = await getImportSnip(value);
        if (snipText) {
            doImport(snipText);
        }
        // otherwise invalid.
    }

    return (
        <Dialog
            // this controls the dialog open state
            open={open}
            onOpenChange={(event, data) => {
                // it is the users responsibility to react accordingly to the open state change
                setOpen(data.open);
            }}
        >
            <DialogSurface>
                <form onSubmit={onClickImport}>
                    <DialogBody>
                        <DialogTitle>{loc("Import Snip")}</DialogTitle>
                        <DialogContent>
                            <div className={styles.base}>
                                <Label className={styles.label} htmlFor={textareaId}>
                                    {loc("Paste a JSON, gist, or url.")}
                                </Label>
                                <Textarea id={textareaId} />
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <DialogTrigger disableButtonEnhancement>
                                <Button appearance="secondary">{loc("Close")}</Button>
                            </DialogTrigger>
                            <DialogTrigger disableButtonEnhancement>
                                <Button type="submit" appearance="primary">
                                    {loc("Import")}
                                </Button>
                            </DialogTrigger>
                        </DialogActions>
                    </DialogBody>
                </form>
            </DialogSurface>
        </Dialog>
    );
}
