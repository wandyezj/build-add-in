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
                    <TooltipButton
                        tip="Back"
                        icon={<ArrowLeftRegular />}
                        onClick={() => {
                            // We want to force a reload when the settings are changed.
                            // So use replace instead of window.history.back()

                            // Back button is only used when navigating from edit.
                            window.location.replace(window.location.origin + "/edit.html");
                        }}
                    />
                ) : (
                    <></>
                )}
                <h1>Settings</h1>
                <Settings />
            </div>
        </FluentProvider>
    );
}
