import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import { loadCurrentSnipId, saveCurrentSnipId } from "./core/storage";
import { getMostRecentlyModifiedSnipId } from "./core/database";

Office.onReady(({ host, platform }) => {
    console.log("Office is ready");
    console.log("Host: ", host);
    console.log("Platform: ", platform);
});

const container = document.getElementById("container")!;
const root = createRoot(container);
root.render(<App />);

async function setup() {
    const currentId = loadCurrentSnipId();
    if (currentId === undefined) {
        const id = await getMostRecentlyModifiedSnipId();
        if (id) {
            saveCurrentSnipId(id);
        }
        // TODO:
        // There should be something in the database.
        // If there isn't, then we should create a new snip.
        // Or use a blank snip?
    }
}

setup();