import React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { Settings } from "./Settings";
import { ArrowLeftRegular } from "@fluentui/react-icons";
import { TooltipButton } from "../components/TooltipButton";

export function App() {
    const goBack = window.location.hash === "#back";

    return (
        <FluentProvider theme={webLightTheme}>
            <div>
                {goBack ? (
                    <TooltipButton tip="Back" icon={<ArrowLeftRegular />} onClick={() => window.history.back()} />
                ) : (
                    <></>
                )}
                <h1>Settings</h1>
                <Settings />
            </div>
        </FluentProvider>
    );
}
