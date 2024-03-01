import React from "react";
import { Clock } from "./Pages/Clock";
import PageRouter from "./PageRouter";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

/**
 * The top level application component.
 */
export function App() {
    return (
        <div id="insert">
            <FluentProvider theme={webLightTheme}>
                <PageRouter />
            </FluentProvider>
        </div>
    );
}
