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
import { DocumentAddRegular } from "@fluentui/react-icons";
import { Snip } from "../core/Snip";
import { saveSnip } from "../core/embed";
import { LogTag, log } from "../core/log";

export function ButtonEmbedCopy({ snip }: { snip: Snip }) {
    function onClickEmbed() {
        log(LogTag.Embed, `Embed  ${snip.id}`);
        saveSnip(snip);
        // TODO: open the new snip
    }

    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                <TooltipButton tip="embed script" icon={<DocumentAddRegular />} />
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Embed Script?</DialogTitle>
                    <DialogContent>{snip.name}</DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Cancel</Button>
                        </DialogTrigger>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="primary" onClick={onClickEmbed}>
                                Embed
                            </Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
