import React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { Blocks } from "./Blocks";

/**
 * The top level application component.
 */
export function App() {
    return (
        <FluentProvider theme={webLightTheme}>
            <Blocks></Blocks>
        </FluentProvider>
    );
}
