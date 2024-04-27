import React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { Settings } from "./Settings";

export function App() {
    return (
        <FluentProvider theme={webLightTheme}>
            <div>
                <h1>Settings</h1>
                <Settings />
            </div>
        </FluentProvider>
    );
}
