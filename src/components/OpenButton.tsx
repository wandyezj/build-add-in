import React, { useEffect } from "react";
import { useState } from "react";
import { DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer, Button } from "@fluentui/react-components";
import { Dismiss24Regular, DocumentFolderRegular } from "@fluentui/react-icons";
import { TooltipButton } from "./TooltipButton";
import { SnipListCard } from "./SnipListCard";
import { getAllSnipMetadata } from "../core/database";
import { SnipMetadata } from "../core/Snip";

/**
 * Enable opening a snip from a list of available snips.
 */
export function OpenButton() {
    const [isOpen, setIsOpen] = useState(false);

    const [localSnips, setLocalSnips] = useState([] as SnipMetadata[]);

    useEffect(() => {
        getAllSnipMetadata().then((snips) => {
            setLocalSnips(snips);
        });
    }, [isOpen]);

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
                    {localSnips.map((item) => (
                        <SnipListCard key={item.id} title={item.name} modified={item.modified} />
                    ))}
                </DrawerBody>
            </OverlayDrawer>

            <TooltipButton tip="Open Snip" icon={<DocumentFolderRegular />} onClick={() => setIsOpen(true)} />
        </div>
    );
}
