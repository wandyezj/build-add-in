import React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { PageEditor } from "./Pages/PageEditor";

/**
 * The top level application component.
 */
export function App() {
    return (
        <div id="insert">
            <FluentProvider theme={webLightTheme}>
                <PageEditor />
            </FluentProvider>
        </div>
    );
}
