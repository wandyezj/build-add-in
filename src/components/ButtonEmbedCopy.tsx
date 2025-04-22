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
import { saveSnip } from "../core/source/embedSnip";
import { LogTag, log } from "../core/log";
import { loc } from "../core/localize/loc";
/**
 * Button to embed a script in the document.
 */
export function ButtonEmbedCopy({ snip }: { snip: Snip }) {
    function onClickEmbed() {
        log(LogTag.Embed, `Embed  ${snip.id}`);
        saveSnip(snip);
        // TODO: open the new snip
    }

    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                <TooltipButton tip={loc("Embed copy of snip")} icon={<DocumentAddRegular />} />
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{loc("Embed Snip in document?")}</DialogTitle>
                    <DialogContent>{snip.name}</DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">{loc("Cancel")}</Button>
                        </DialogTrigger>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="primary" onClick={onClickEmbed}>
                                {loc("Embed")}
                            </Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
