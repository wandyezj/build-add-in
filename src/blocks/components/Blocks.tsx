import React from "react";

import { Block } from "./Block";
import { CodeTemplateBlock } from "../CodeTemplateBlock";

export function Blocks({
    blocks,
    updateParameterValue,
}: {
    blocks: CodeTemplateBlock[];
    updateParameterValue: (blockIndex: number, parameterKey: string, value: unknown) => void;
}) {
    const renderedBlocks = blocks.map((block, index) => {
        const updateBlockParameter = (parameterKey: string, value: unknown) => {
            updateParameterValue(index, parameterKey, value);
        };
        return <Block key={index} block={block} updateParameterValue={updateBlockParameter} />;
    });

    return renderedBlocks;
}
