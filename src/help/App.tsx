import React, { MouseEventHandler } from "react";
import { FluentProvider, webLightTheme, Link } from "@fluentui/react-components";

const tutorialText = "Tutorial";
const tutorialUrl = "https://github.com/wandyezj/build-add-in/blob/main/docs/tutorial.md";

const apiReferenceText = "API Reference";
const apiReferenceUrl = "https://learn.microsoft.com/en-us/javascript/api/overview?view=common-js-preview";

/**
 * The top level application component.
 */
export function App() {
    return (
        <FluentProvider theme={webLightTheme}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <ButtonLink text={tutorialText} url={tutorialUrl} />
                <br></br>
                <br></br>
                <ButtonLink text={apiReferenceText} url={apiReferenceUrl} />
            </div>
        </FluentProvider>
    );
}

function ButtonLink({ text, url }: { text: string; url: string }) {
    function onClickTutorial() {
        window.open(url, "_blank");
    }

    return (
        <Link onClick={onClickTutorial} as="button">
            {text}
        </Link>
    );
}
