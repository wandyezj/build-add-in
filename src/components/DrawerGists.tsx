import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer, Button } from "@fluentui/react-components";
import { Dismiss24Regular, ArrowSyncRegular } from "@fluentui/react-icons";
import { TooltipButton } from "./TooltipButton";
import { saveSnip } from "../core/database";
import { GistListCard } from "./SampleListCard";
import { SnipMetadata, SnipWithSource, completeSnip } from "../core/Snip";
import { sourceSnipGitHub } from "../core/source/sourceSnipGitHubGists";

async function getItemById(id: string) {
    const item = sourceSnipGitHub.getItemById(id);
    return item;
}

// Should be gist metadata
async function getAllMetadata(): Promise<SnipMetadata[]> {
    const metadata = await sourceSnipGitHub.getAllItemMetadata().catch((error) => {
        console.error(`Error getting metadata: ${error}`);
        return [];
    });
    // probably want to order this somehow.
    // display in last modified order
    //snips.sort((a, b) => b.modified - a.modified);
    return metadata;
}

/**
 * Enable opening a snip from a list of GitHub gists.
 */
export function DrawerGists({
    openSnip,
    isOpen,
    setIsOpen,
}: {
    openSnip: (snip: SnipWithSource) => void;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [samples, setSamples] = useState([] as SnipMetadata[]);

    function refreshGists() {
        getAllMetadata().then((samples) => {
            setSamples(samples);
        });
    }

    useEffect(() => {
        getAllMetadata().then((samples) => {
            if (samples.length === 0) {
                // If there are no initial samples then load them
                reloadSamples();
            } else {
                setSamples(samples);
            }
        });
    }, [isOpen]);

    /**
     * Refresh samples from the source.
     */
    async function reloadSamples() {
        setSamples([]);

        refreshGists();
    }

    const clickCard = (id: string) => {
        console.log(`clicked card ${id}`);
        setIsOpen(false);
        getItemById(id).then((item) => {
            // create copy of the sample and open

            // TODO: what if sample is undefined?
            if (item) {
                // Copy the sample and create a new snip
                const snip = completeSnip({ ...item, name: `(copy) ${item.name}` });
                saveSnip(snip);
                openSnip({ ...snip, source: "local" });
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
                        Gist Snips
                    </DrawerHeaderTitle>
                </DrawerHeader>

                <DrawerBody>
                    <TooltipButton tip="Refresh Gists" icon={<ArrowSyncRegular />} onClick={reloadSamples} />
                    {samples.map(({ id, name }) => (
                        <GistListCard
                            key={id}
                            id={id}
                            title={name}
                            description={id}
                            link={`https://gist.github.com/${id}`}
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
