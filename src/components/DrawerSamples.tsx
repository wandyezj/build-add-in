import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer, Button } from "@fluentui/react-components";
import { Dismiss24Regular, ArrowSyncRegular } from "@fluentui/react-icons";
import { TooltipButton } from "./TooltipButton";
import { SampleMetadata, loadSamplesToDatabase } from "../core/Sample";
import { deleteSampleById, getAllSampleMetadata, getSampleById, saveSnip } from "../core/database";
import { SampleListCard } from "./SampleListCard";
import { SnipWithSource, completeSnip } from "../core/Snip";
import { getHostName } from "../core/globals";

function snipsWithTag(snips: SampleMetadata[], host: string) {
    return snips.filter((snip) => {
        const { tags } = snip;
        return tags !== undefined && tags.includes(host);
    });
}

function snipsForHost(snips: SampleMetadata[]) {
    const host = getHostName();
    const hostSnips = snipsWithTag(snips, host);
    return hostSnips;
}

async function getAllSamples(): Promise<SampleMetadata[]> {
    const snips = await getAllSampleMetadata();

    const hostSnips = snipsForHost(snips);
    // probably want to order this somehow.
    // display in last modified order
    //snips.sort((a, b) => b.modified - a.modified);
    return hostSnips;
}

async function deleteAllSamplesForHost() {
    // Delete all samples from the database
    const allSamples = await getAllSamples();
    const targetSamples = snipsForHost(allSamples);
    const promises = targetSamples.map((sample) => {
        deleteSampleById(sample.id);
    });
    await Promise.all(promises);
}

/**
 * Enable opening a snip from a list of available snips.
 */
export function DrawerSamples({
    openSnip,
    isOpen,
    setIsOpen,
}: {
    openSnip: (snip: SnipWithSource) => void;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [samples, setSamples] = useState([] as SampleMetadata[]);

    function refreshSamples() {
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
        // Delete all samples from the database
        await deleteAllSamplesForHost();

        // Freshly load the samples
        const host = getHostName();
        await loadSamplesToDatabase(host);
        refreshSamples();
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
        </>
    );
}
