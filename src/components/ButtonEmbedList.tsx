import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer, Button } from "@fluentui/react-components";
import { Dismiss24Regular, DocumentRegular } from "@fluentui/react-icons";
import { TooltipButton } from "./TooltipButton";
import { SampleListCard } from "./SampleListCard";
import { Snip, SnipMetadata, SnipWithSource } from "../core/Snip";
import { getAllSnipMetadata, getSnipById } from "../core/embed";
import { formatModified } from "../core/formatModified";

async function getAllEmbed() {
    const metadata = await getAllSnipMetadata();
    return metadata;
}

/**
 * Enable opening a snip from a list of available snips.
 */
export function ButtonEmbedList({ openSnip }: { openSnip: (snip: SnipWithSource) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const [snips, setSnips] = useState([] as SnipMetadata[]);

    useEffect(() => {
        getAllEmbed().then((snips) => {
            setSnips(snips);
        });
    }, [isOpen]);

    const clickCard = (id: string) => {
        console.log(`clicked card ${id}`);
        setIsOpen(false);
        getSnipById(id).then((snip) => {
            // create copy of the sample and open

            // TODO: what if sample is undefined?
            if (snip) {
                openSnip({ ...snip, source: "embed" });
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
                        Embed Snips
                    </DrawerHeaderTitle>
                </DrawerHeader>

                <DrawerBody>
                    {snips.map(({ id, modified, name }) => (
                        <SampleListCard
                            key={id}
                            id={id}
                            title={name}
                            description={formatModified(modified)}
                            onClick={() => {
                                clickCard(id);
                            }}
                        />
                    ))}
                </DrawerBody>
            </OverlayDrawer>

            <TooltipButton tip="Embed Snips" icon={<DocumentRegular />} onClick={() => setIsOpen(true)} />
        </div>
    );
}
