import React from "react";
import { FluentProvider, webLightTheme, Button } from "@fluentui/react-components";

const tutorialUrl = "https://github.com/wandyezj/build-add-in/blob/main/docs/tutorial.md";
function onClickTutorial() {
    window.open(tutorialUrl, "_blank");
}

/**
 * The top level application component.
 */
export function App() {
    return (
        <FluentProvider theme={webLightTheme}>
            <Button size={"large"} appearance={"primary"} onClick={onClickTutorial}>
                Tutorial
            </Button>
        </FluentProvider>
    );
}
