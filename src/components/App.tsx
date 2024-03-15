import React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { PageEditor } from "./PageEditor";
import { Snip } from "../core/Snip";

/**
 * The top level application component.
 */
export function App({ initialSnip }: { initialSnip: Snip }) {
    return (
        <FluentProvider theme={webLightTheme}>
            <PageEditor initialSnip={initialSnip} />
        </FluentProvider>
    );
}
