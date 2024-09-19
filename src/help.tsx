import React from "react";
import { LogTag, log } from "./core/log";
import { createRoot } from "react-dom/client";
import { App } from "./help/App";

async function setup() {
    log(LogTag.SetupStart);
    const container = document.getElementById("container")!;
    const root = createRoot(container);
    root.render(<App />);
    log(LogTag.SetupEnd);
}

setup();

// Calling Office.onReady after setup loads the UI faster.
Office.onReady(({ host, platform }) => {
    console.log(`Office is ready
Host: ${host}
Platform: ${platform}`);
});
