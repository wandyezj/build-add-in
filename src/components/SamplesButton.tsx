import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer, Button } from "@fluentui/react-components";
import { Dismiss24Regular, BookDefault28Regular, ArrowSyncRegular } from "@fluentui/react-icons";
import { TooltipButton } from "./TooltipButton";
import { SampleMetadata, loadSamplesToDatabase } from "../core/Sample";
import { deleteSampleById, getAllSampleMetadata, getSampleById, saveSnip } from "../core/database";
import { SampleListCard } from "./SampleListCard";
import { Snip, completeSnip } from "../core/Snip";

async function getAllSamples(): Promise<SampleMetadata[]> {
    const snips = await getAllSampleMetadata();

    // probably want to order this somehow.
    // display in last modified order
    //snips.sort((a, b) => b.modified - a.modified);
    return snips;
}

/**
 * Enable opening a snip from a list of available snips.
 */
export function SamplesButton({ openSnip }: { openSnip: (snip: Snip) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const [samples, setSamples] = useState([] as SampleMetadata[]);

    function refreshSamples() {
        getAllSamples().then((samples) => {
            setSamples(samples);
        });
    }

    useEffect(() => {
        refreshSamples();
    }, [isOpen]);

    /**
     * Refresh samples from the source.
     */
    async function reloadSamples() {
        // Delete all samples from the database
        await deleteAllSamples();

        // Freshly load the samples
        await loadSamplesToDatabase();
        refreshSamples();
    }

    async function deleteAllSamples() {
        // Delete all samples from the database
        const allSamples = await getAllSamples();
        const promises = allSamples.map((sample) => {
            deleteSampleById(sample.id);
        });
        await Promise.all(promises);
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
                        Sample Snips
                    </DrawerHeaderTitle>
                </DrawerHeader>

                <DrawerBody>
                    <TooltipButton tip="Refresh Samples" icon={<ArrowSyncRegular />} onClick={reloadSamples} />
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

            <TooltipButton tip="Sample Snips" icon={<BookDefault28Regular />} onClick={() => setIsOpen(true)} />
        </div>
    );
}
