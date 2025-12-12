import React, { useEffect } from "react";
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
import { SnipWithSource, completeSnip, getExportSnipFromExportJson } from "../core/Snip";
import { saveSnip } from "../core/snipStorage";
import { loc } from "../core/localize/loc";
import { getImportSnip } from "../core/getImportSnip";

const useStyles = makeStyles({
    base: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        marginBottom: tokens.spacingVerticalMNudge,
    },
});

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
    const [importText, setImportText] = React.useState("");

    useEffect(() => {
        // Reset the import text when the dialog opens
        if (open) {
            setImportText("");
        }
    }, [open]);

    const textareaId = useId("import-textarea");
    const styles = useStyles();

    async function doImport(value: string) {
        log(LogTag.ButtonImport, "doImport");
        const snip = await importSnip(value);
        if (snip) {
            openSnip(snip);
        }
    }

    async function onClickImport() {
        log(LogTag.ButtonImport, "import");
        const snipText = await getImportSnip(importText);
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
                <DialogBody>
                    <DialogTitle>{loc("Import Snip")}</DialogTitle>
                    <DialogContent>
                        <div className={styles.base}>
                            <Label className={styles.label} htmlFor={textareaId}>
                                {loc("Paste a JSON, gist, or url.")}
                            </Label>
                            <Textarea
                                value={importText}
                                onChange={(e, data) => setImportText(data.value)}
                                id={textareaId}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">{loc("Close")}</Button>
                        </DialogTrigger>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="primary" onClick={onClickImport}>
                                {loc("Import")}
                            </Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
