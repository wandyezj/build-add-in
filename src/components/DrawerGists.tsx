import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer, Button } from "@fluentui/react-components";
import { Dismiss24Regular, ArrowSyncRegular } from "@fluentui/react-icons";
import { TooltipButton } from "./TooltipButton";
import { SampleMetadata } from "../core/Sample";
import { getSampleById, saveSnip } from "../core/database";
import { SampleListCard } from "./SampleListCard";
import { SnipWithSource, completeSnip } from "../core/Snip";

// Should be gist metadata
async function getAllSamples(): Promise<SampleMetadata[]> {
    // probably want to order this somehow.
    // display in last modified order
    //snips.sort((a, b) => b.modified - a.modified);
    return [];
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
    const [samples, setSamples] = useState([] as SampleMetadata[]);

    function refreshGists() {
        getAllSamples().then((samples) => {
            setSamples(samples);
        });
    }

    useEffect(() => {
        getAllSamples().then((samples) => {
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
        getSampleById(id).then((sample) => {
            // create copy of the sample and open

            // TODO: what if sample is undefined?
            if (sample) {
                // Copy the sample and create a new snip
                const snip = completeSnip({ ...sample, name: `(copy) ${sample.name}` });
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
                    {samples.map(({ id, name, description }) => (
                        <SampleListCard
                            key={id}
                            id={id}
                            title={name}
                            description={description}
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
