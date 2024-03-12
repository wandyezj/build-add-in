import React from "react";
import { Button, FluentProvider, webLightTheme } from "@fluentui/react-components";
import { Blocks } from "./Blocks";
import { exampleCodeBlocks } from "../exampleCodeBlocks";
import { newDefaultSnip } from "../../core/newDefaultSnip";
import { saveCurrentSnipId } from "../../core/storage";
import { saveSnip } from "../../core/database";
import { CodeTemplateBlock, getFilledTemplate } from "../CodeTemplateBlock";

/**
 * The top level application component.
 */
export function App() {
    const blocks = exampleCodeBlocks;

    const run = async () => {
        console.log("Run");
        // turn blocks into code
        runBlocks(blocks);
    };
    // TODO: track block parameters
    return (
        <FluentProvider theme={webLightTheme}>
            <Button onClick={run}>Run</Button>
            <Blocks blocks={blocks}></Blocks>
        </FluentProvider>
    );
}

async function runBlocks(blocks: CodeTemplateBlock[]) {
    blocks.forEach((block) => {
        getFilledTemplate(block.template, []);
    });
    // run code by overwriting a fixed snip and setting it as the current snip for the runner to pick up.
    const snipBlockId = "block";
    const snip = newDefaultSnip();
    snip.id = snipBlockId;
    // set the content of the script file
    snip.files["html"].content = "";
    snip.files["css"].content = "";
    snip.files["libraries"].content = "";
    snip.files["typescript"].content = "console.log('Hello, world!');";

    await saveSnip(snip);
    saveCurrentSnipId(snipBlockId);
}
