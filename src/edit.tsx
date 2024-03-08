import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";

Office.onReady(({ host, platform }) => {
    console.log("Office is ready");
    console.log("Host: ", host);
    console.log("Platform: ", platform);
});

const container = document.getElementById("container")!;
const root = createRoot(container);
root.render(<App />);
