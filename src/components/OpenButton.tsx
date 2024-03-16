import React from "react";
import { useState } from "react";
import { DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer, Button } from "@fluentui/react-components";
import { Dismiss24Regular, DocumentFolderRegular } from "@fluentui/react-icons";
import { TooltipButton } from "./TooltipButton";
import { SnipListCard } from "./SnipListCard";

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
                        Local Snips
                    </DrawerHeaderTitle>
                </DrawerHeader>

                <DrawerBody>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
                            <SnipListCard key={index} />
                        )) // [1]
                    }
                </DrawerBody>
            </OverlayDrawer>

            <TooltipButton tip="Open Snip" icon={<DocumentFolderRegular />} onClick={() => setIsOpen(true)} />
        </div>
    );
}
