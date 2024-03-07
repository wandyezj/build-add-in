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

const useStyles = makeStyles({
    base: {
        display: "flex",
        flexDirection: "column",
        "& > label": {
            marginBottom: tokens.spacingVerticalMNudge,
        },
    },
});

export function ImportButton({ setImport }: { setImport: (value: string) => void }) {
    const textareaId = useId("textarea");
    const styles = useStyles();

    function onClickImport() {
        console.log("import", textareaId);
        const value = (document.getElementById(textareaId) as HTMLTextAreaElement).value;
        setImport(value);
    }

    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                <TooltipButton tip="Import" icon={<ArrowDownloadRegular />} />
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Import Snip Json</DialogTitle>
                    <DialogContent>
                        <div className={styles.base}>
                            <Label htmlFor={textareaId}>Paste the JSON</Label>
                            <Textarea id={textareaId} />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Close</Button>
                        </DialogTrigger>
                        <Button appearance="primary" onClick={onClickImport}>
                            Import
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
