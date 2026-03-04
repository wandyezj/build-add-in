import React from "react";
import { LogTag, log } from "./core/log";
import { createRoot } from "react-dom/client";
import { App } from "./settings/App";
import { setupOffice } from "./core/setupOffice";

async function setup() {
    // Must load office.js because loc requires it to check the display language.
    await setupOffice();
    log(LogTag.SetupStart);

    // This avoids a race condition.
    const container = document.getElementById("container")!;
    const root = createRoot(container);
    root.render(<App></App>);
    log(LogTag.SetupEnd);
}

setup();
