import { website } from "./website";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";

console.log(website());

const container = document.getElementById("react-app")!;
const root = createRoot(container);
root.render(<App />);
