import React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { BlocksView } from "./BlocksView";
import { exampleCodeBlocks } from "../exampleCodeBlocks";
import { runBlocks } from "./runBlocks";
import { CodeTemplateBlock, CodeTemplateBlockParameterValue } from "../CodeTemplateBlock";

/**
 * The top level application component.
 */
export function App() {
    // TODO: track block parameters
    const blocks = exampleCodeBlocks;
    const run = async (
        blocks: CodeTemplateBlock[],
        parameterValues: Record<string, CodeTemplateBlockParameterValue>[]
    ) => {
        console.log("Run");
        // turn blocks into code
        runBlocks(blocks, parameterValues);
    };

    return (
        <FluentProvider theme={webLightTheme}>
            <BlocksView blocks={blocks} parameterUpdateCallback={run}></BlocksView>
        </FluentProvider>
    );
}
