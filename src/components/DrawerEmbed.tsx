import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer, Button } from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";
import { SampleListCard } from "./SampleListCard";
import { SnipMetadata, SnipWithSource } from "../core/Snip";
import { getAllSnipMetadata, getSnipById } from "../core/source/embedSnip";
import { formatModified } from "../core/util/formatModified";

async function getAllEmbed() {
    const metadata = await getAllSnipMetadata();
    return metadata;
}

/**
 * Enable opening a snip from a list of available snips.
 */
export function DrawerEmbed({
    openSnip,
    isOpen,
    setIsOpen,
}: {
    openSnip: (snip: SnipWithSource) => void;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [snips, setSnips] = useState([] as SnipMetadata[]);

    function reload() {
        getAllEmbed().then((snips) => {
            setSnips(snips);
        });
    }
    useEffect(() => {
        reload();
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
        <>
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
        </>
    );
}
