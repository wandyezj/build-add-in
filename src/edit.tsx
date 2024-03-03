import { website } from "./website";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";

Office.onReady(({ host, platform }) => {
    console.log("Office is ready");
    console.log("Host: ", host);
    console.log("Platform: ", platform);
});

console.log(website());

const container = document.body;
const root = createRoot(container);
root.render(<App />);
