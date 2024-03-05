import React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { PageEditor } from "./PageEditor";

/**
 * The top level application component.
 */
export function App() {
    return (
        <FluentProvider theme={webLightTheme}>
            <PageEditor />
        </FluentProvider>
    );
}
