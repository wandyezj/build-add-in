import React from "react";

import { Block } from "./Block";
import { CodeTemplateBlock } from "../CodeTemplateBlock";

export function Blocks({ blocks }: { blocks: CodeTemplateBlock[] }) {
    const renderedBlocks = blocks.map((block, index) => {
        return <Block key={index} block={block} />;
    });

    return renderedBlocks;
}
