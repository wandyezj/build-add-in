import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import { deleteCurrentSnipReference, loadCurrentSnipReference, saveCurrentSnipReference } from "./core/storage";
import { getMostRecentlyModifiedSnipId, saveSnip } from "./core/database";
import { getSnipById } from "./core/snipStorage";
import { newDefaultSnip } from "./core/newDefaultSnip";
import { log, LogTag } from "./core/log";
import { Snip, SnipReference, SnipSource } from "./core/Snip";
import { officeSetup } from "./core/officeSetup";

async function initializeCurrentId(): Promise<SnipReference> {
    let reference = loadCurrentSnipReference();

    if (reference === undefined) {
        let id = await getMostRecentlyModifiedSnipId();
        const source = "local";

        if (id === undefined) {
            // There should be something in the database.
            // If there isn't, create a new default snip.

            const newSnip = newDefaultSnip();
            id = newSnip.id;
            await saveSnip(newSnip);
        }
        reference = { id, source };
        saveCurrentSnipReference(reference);
    }

    return reference;
}

/**
 * The initial snip to open is the first of:
 * - The snip id from local storage
 * - The most recently modified snip
 * - A new default snip
 */
async function getInitialSnip(): Promise<Snip> {
    const currentId = await initializeCurrentId();
    log(LogTag.Setup, "currentId - complete");
    const initialSnip = await getSnipById(currentId);
    log(LogTag.Setup, "initialSnip - complete");

    if (initialSnip === undefined) {
        // Reset the current id and try again.
        deleteCurrentSnipReference();
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

async function persistData() {
    // Attempt to persist data.
    // note: Any run writes to local storage data are also persisted.

    // https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist
    const persisted = await navigator.storage.persisted();
    if (persisted) {
        console.log("Storage persist [true]");
        return;
    }

    const persist = await navigator.storage.persist();
    console.log(`Storage persist [${persist ? "true" : "FALSE"}]`);
}

async function setup() {
    log(LogTag.SetupStart);
    await officeSetup;
    const initialSnip = await getInitialSnip();

    // Start Render AFTER we have the current snip id.
    // This avoids a race condition.
    const container = document.getElementById("container")!;
    const root = createRoot(container);
    root.render(<App initialSnip={initialSnip} />);

    // Persist is lower priority than rendering.
    persistData();
    log(LogTag.SetupEnd);
}

setup();
