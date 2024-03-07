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

export function ImportButton() {
    const textareaId = useId("textarea");
    const styles = useStyles();

    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                <TooltipButton tip="Import" icon={<ArrowDownloadRegular />} />
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Dialog title</DialogTitle>
                    <DialogContent>
                        <div className={styles.base}>
                            <Label htmlFor={textareaId}>Default Textarea</Label>
                            <Textarea id={textareaId} />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Close</Button>
                        </DialogTrigger>
                        <Button appearance="primary">Import</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
