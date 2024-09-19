// Shared runtime, will be used for snips that should run in the background.

import { setupOffice } from "./core/setupOffice";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./shared/App";
import { run } from "./shared/run";

// Some rules for snips to run in the background
// must
//  - only allow one to run in the background
//  - be embedded in the document
//  - only have default library references
// Want a button to go back from currently loaded
// Want a button to load a new one.

async function setup() {
    await setupOffice();

    // After the first time the add in is opened it will automatically load
    Office.addin.setStartupBehavior(Office.StartupBehavior.load);

    if (window.location.hash === "#reset") {
        const container = document.getElementById("container")!;
        const root = createRoot(container);
        root.render(<App />);
    } else {
        run();
    }

    // back will act as reload in this case.
}

setup();
