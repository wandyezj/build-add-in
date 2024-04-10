import React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { ButtonLink } from "./ButtonLink";

const tutorialText = "Tutorial";
const tutorialUrl = "https://github.com/wandyezj/build-add-in/blob/main/docs/tutorial.md";

const apiReferenceText = "API Reference";
const apiReferenceUrl = "https://learn.microsoft.com/en-us/javascript/api/overview?view=common-js-preview";

const reportIssueText = "Report an issue";
const reportIssueUrl = "https://github.com/wandyezj/build-add-in/issues";

const links = [
    { text: tutorialText, url: tutorialUrl },
    { text: apiReferenceText, url: apiReferenceUrl },
    { text: reportIssueText, url: reportIssueUrl },
];

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
                {links.map(({ text, url }, index) => (
                    <>
                        <ButtonLink key={index} text={text} url={url} />
                        <br></br>
                        <br></br>
                    </>
                ))}
                
            </div>
        </FluentProvider>
    );
}
