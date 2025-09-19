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
import { SnipWithSource } from "../core/Snip";
import { loc } from "../core/localize/loc";
import { SnipAuthor } from "./SnipAuthor";

const useStyles = makeStyles({
    base: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        marginBottom: tokens.spacingVerticalMNudge,
    },
});

export function DialogAuthorView({
    open,
    setOpen,
    snip,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    snip: SnipWithSource;
}) {
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
                    <DialogTitle>{loc("Author")}</DialogTitle>
                    <DialogContent>
                        <div className={styles.base}>
                            <SnipAuthor snip={snip} />
                        </div>
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
