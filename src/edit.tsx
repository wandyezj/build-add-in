import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import { loadCurrentSnipId, saveCurrentSnipId } from "./core/storage";
import { getMostRecentlyModifiedSnipId, getSnipById, saveSnip } from "./core/database";
import { newDefaultSnip } from "./core/newDefaultSnip";
import { log, LogTag } from "./core/log";

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

async function setup() {
    log(LogTag.SetupStart);
    const currentId = await initializeCurrentId();
    log(LogTag.Setup, "currentId - complete");
    const initialSnip = await getSnipById(currentId);
    log(LogTag.Setup, "initialSnip - complete");
    if (initialSnip === undefined) {
        // Should be impossible?
        throw new Error("Failed to load initial snip");
    }

    // Start Render AFTER we have the current snip id
    const container = document.getElementById("container")!;
    const root = createRoot(container);
    root.render(<App initialSnip={initialSnip} />);
    log(LogTag.SetupEnd);
}

setup();

Office.onReady(({ host, platform }) => {
    console.log("Office is ready");
    console.log("Host: ", host);
    console.log("Platform: ", platform);
});
