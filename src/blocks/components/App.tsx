import React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { BlocksView } from "./BlocksView";

/**
 * The top level application component.
 */
export function App() {
    // TODO: track block parameters
    return (
        <FluentProvider theme={webLightTheme}>
            <BlocksView></BlocksView>
        </FluentProvider>
    );
}
