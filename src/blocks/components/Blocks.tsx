import React from "react";

import { exampleCodeBlocks } from "../exampleCodeBlocks";
import { Block } from "./Block";

export function Blocks() {
    const blocks = exampleCodeBlocks.map((block) => {
        return <Block block={block} />;
    });

    return blocks;
}
