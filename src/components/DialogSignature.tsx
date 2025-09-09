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

import { makeStyles, tokens } from "@fluentui/react-components";
import { LogTag, log } from "../core/log";
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

export function DialogSignature({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
    const styles = useStyles();

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
                    <DialogTitle>{loc("Signature")}</DialogTitle>
                    <DialogContent>
                        <div className={styles.base}>Stuff about the signature goes here.</div>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="primary">{loc("Close")}</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
