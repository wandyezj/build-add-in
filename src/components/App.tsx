import React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { PageEditor } from "./PageEditor";
import { SnipWithSource } from "../core/Snip";

/**
 * The top level application component.
 */
export function App({ initialSnip }: { initialSnip: SnipWithSource }) {
    return (
        <FluentProvider theme={webLightTheme}>
            <PageEditor initialSnip={initialSnip} />
        </FluentProvider>
    );
}
