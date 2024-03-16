import React from "react";
import { useState } from "react";
import { DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer, Button } from "@fluentui/react-components";
import { Dismiss24Regular, DocumentFolderRegular } from "@fluentui/react-icons";
import { TooltipButton } from "./TooltipButton";

/**
 * Enable opening a snip from a list of available snips.
 */
export function OpenButton() {
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
                        Overlay Drawer
                    </DrawerHeaderTitle>
                </DrawerHeader>

                <DrawerBody>
                    <p>Drawer content</p>
                </DrawerBody>
            </OverlayDrawer>

            <TooltipButton tip="Open Snip" icon={<DocumentFolderRegular />} onClick={() => setIsOpen(true)} />
        </div>
    );
}
