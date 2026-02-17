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
                {goBack && (
                    <TooltipButton
                        tip="Back"
                        icon={<ArrowLeftRegular />}
                        onClick={() => {
                            // We want to force a reload when the settings are changed.
                            // So use replace instead of window.history.back()

                            // Back button is only used when navigating from edit.
                            const origin = window.location.origin;
                            const pathname = window.location.pathname;

                            // Replace settings2.html with edit.html
                            const backLocation = origin + pathname.replace(/settings2.html$/, "edit.html");
                            window.location.replace(backLocation);
                        }}
                    />
                )}
                <h1>Settings</h1>
                <Settings />
            </div>
        </FluentProvider>
    );
}
