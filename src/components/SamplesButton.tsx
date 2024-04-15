import React from "react";
import { useState } from "react";
import { DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer, Button } from "@fluentui/react-components";
import { Dismiss24Regular, BookDefault28Regular } from "@fluentui/react-icons";
import { TooltipButton } from "./TooltipButton";

/**
 * Enable opening a snip from a list of available snips.
 */
export function SamplesButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
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
                        Sample Snips
                    </DrawerHeaderTitle>
                </DrawerHeader>

                <DrawerBody></DrawerBody>
            </OverlayDrawer>

            <TooltipButton tip="Sample Snips" icon={<BookDefault28Regular />} onClick={() => setIsOpen(true)} />
        </div>
    );
}
