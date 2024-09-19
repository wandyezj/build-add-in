import React from "react";
import { Button, FluentProvider, webLightTheme } from "@fluentui/react-components";
import { run } from "./run";

/**
 * The top level application component.
 */
export function App() {
    return (
        <FluentProvider theme={webLightTheme}>
            <Button onClick={run}>Start</Button>
        </FluentProvider>
    );
}
