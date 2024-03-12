import React, { useState } from "react";

import { Button } from "@fluentui/react-components";
import { Blocks } from "./Blocks";
import { exampleCodeBlocks } from "../exampleCodeBlocks";
import { newDefaultSnip } from "../../core/newDefaultSnip";
import { saveCurrentSnipId } from "../../core/storage";
import { saveSnip } from "../../core/database";
import { CodeTemplateBlock, CodeTemplateBlockParameterValue, getFilledTemplate } from "../CodeTemplateBlock";

function objectClone<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
}

export function BlocksView() {
    const blocks = exampleCodeBlocks;

    const originalValues = blocks.map((block) => {
        const values = {} as Record<string, CodeTemplateBlockParameterValue>;
        const { parameters } = block;
        for (const key of Object.getOwnPropertyNames(parameters)) {
            const parameter = parameters[key];
            values[key] = objectClone(parameter);
        }

        return values;
    });
    const [
        parameterValues, // setParameterValues
    ] = useState(originalValues);

    // const updateParameterValue = (blockIndex: number, parameterKey: string, value: CodeTemplateBlockParameterValue) => {
    //     const newValues = parameterValues;
    //     newValues[blockIndex][parameterKey].value = value.value;
    // };

    const run = async () => {
        console.log("Run");
        // turn blocks into code
        runBlocks(blocks, parameterValues);
    };

    return (
        <>
            <Button onClick={run}>Run</Button>
            <Blocks blocks={blocks}></Blocks>
        </>
    );
}

async function runBlocks(blocks: CodeTemplateBlock[], parameters: Record<string, CodeTemplateBlockParameterValue>[]) {
    const code = blocks
        .map((block, index) => {
            const params = parameters[index];
            return getFilledTemplate(block.template, params);
        })
        .join("\n");
    console.log(code);

    // run code by overwriting a fixed snip and setting it as the current snip for the runner to pick up.
    const snipBlockId = "block";
    const snip = newDefaultSnip();
    snip.id = snipBlockId;
    // set the content of the script file
    snip.files["html"].content = "";
    snip.files["css"].content = "";
    snip.files["libraries"].content = "";
    snip.files["typescript"].content = code;

    await saveSnip(snip);
    saveCurrentSnipId(snipBlockId);
}
