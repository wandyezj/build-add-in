import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import { deleteCurrentSnipId, loadCurrentSnipId, saveCurrentSnipId } from "./core/storage";
import { getMostRecentlyModifiedSnipId, getSnipById, saveSnip } from "./core/database";
import { newDefaultSnip } from "./core/newDefaultSnip";
import { log, LogTag } from "./core/log";
import { Snip } from "./core/Snip";

async function initializeCurrentId(): Promise<string> {
    let currentId = loadCurrentSnipId();
    if (currentId === undefined) {
        currentId = await getMostRecentlyModifiedSnipId();
        if (currentId === undefined) {
            // There should be something in the database.
            // If there isn't, create a new default snip.

            const newSnip = newDefaultSnip();
            currentId = newSnip.id;
            await saveSnip(newSnip);
        }
        saveCurrentSnipId(currentId);
    }
    return currentId;
}

async function getInitialSnip(): Promise<Snip> {
    const currentId = await initializeCurrentId();
    log(LogTag.Setup, "currentId - complete");
    const initialSnip = await getSnipById(currentId);
    log(LogTag.Setup, "initialSnip - complete");

    if (initialSnip === undefined) {
        // Reset the current id and try again.
        deleteCurrentSnipId();
        const currentId = await initializeCurrentId();
        const initialSnip = await getSnipById(currentId);
        if (initialSnip === undefined) {
            // Should be impossible?
            throw new Error("Failed to load initial snip");
        }
        return initialSnip;
    }
    return initialSnip;
}

async function setup() {
    log(LogTag.SetupStart);
    const initialSnip = await getInitialSnip();

    // Start Render AFTER we have the current snip id
    const container = document.getElementById("container")!;
    const root = createRoot(container);
    root.render(<App initialSnip={initialSnip} />);
    log(LogTag.SetupEnd);
}

setup();

Office.onReady(({ host, platform }) => {
    console.log(`Office is ready
Host: ${host}
Platform: ${platform}`);
});
