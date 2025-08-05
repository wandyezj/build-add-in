import React from "react";
import { FluentProvider, webLightTheme, webDarkTheme } from "@fluentui/react-components";
import { PageEdit } from "./PageEdit";
import { SnipWithSource } from "../core/Snip";
import { getTheme } from "../core/settings/getTheme";
import { Theme } from "../core/settings/Theme";

function getFluentProviderTheme() {
    const theme = getTheme();
    switch (theme) {
        case Theme.Dark:
            return webDarkTheme;
        case Theme.Light:
            return webLightTheme;
    }
}

/**
 * The top level application component.
 */
export function App({ initialSnip }: { initialSnip: SnipWithSource }) {
    const theme = getFluentProviderTheme();

    return (
        <FluentProvider theme={theme}>
            <PageEdit initialSnip={initialSnip} />
        </FluentProvider>
    );
}
