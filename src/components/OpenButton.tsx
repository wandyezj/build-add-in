import React, { useEffect } from "react";
import { useState } from "react";
import { DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer, Button } from "@fluentui/react-components";
import { Dismiss24Regular, DocumentFolderRegular } from "@fluentui/react-icons";
import { TooltipButton } from "./TooltipButton";
import { SnipListCard } from "./SnipListCard";
import { getAllSnipMetadata, getSnipById } from "../core/database";
import { Snip, SnipMetadata } from "../core/Snip";

/**
 * Enable opening a snip from a list of available snips.
 */
export function OpenButton({ openSnip }: { openSnip: (snip: Snip) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const [localSnips, setLocalSnips] = useState([] as SnipMetadata[]);

    useEffect(() => {
        getAllSnipMetadata().then((snips) => {
            // display in last modified order
            snips.sort((a, b) => b.modified - a.modified);
            setLocalSnips(snips);
        });
    }, [isOpen]);

    const clickCard = (id: string) => {
        console.log(`clicked card ${id}`);
        setIsOpen(false);
        getSnipById(id).then((snip) => {
            // TODO: what if snip is undefined?
            if (snip) {
                openSnip(snip);
            }
        });
    };

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
                    {localSnips.map(({ id, name, modified }) => (
                        <SnipListCard
                            key={id}
                            id={id}
                            title={name}
                            modified={modified}
                            onClick={() => {
                                clickCard(id);
                            }}
                        />
                    ))}
                </DrawerBody>
            </OverlayDrawer>

            <TooltipButton tip="Open Snip" icon={<DocumentFolderRegular />} onClick={() => setIsOpen(true)} />
        </div>
    );
}
