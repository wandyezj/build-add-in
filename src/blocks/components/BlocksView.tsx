import React, { useState } from "react";

import { Blocks } from "./Blocks";
import { CodeTemplateBlock, CodeTemplateBlockParameterValue } from "../CodeTemplateBlock";
import { objectClone } from "../../core/util/objectClone";

export function BlocksView({
    blocks,
    parameterUpdateCallback,
}: {
    blocks: CodeTemplateBlock[];
    parameterUpdateCallback: (
        blocks: CodeTemplateBlock[],
        parameterValues: Record<string, CodeTemplateBlockParameterValue>[]
    ) => void;
}) {
    const originalValues = blocks.map((block) => {
        const values = {} as Record<string, CodeTemplateBlockParameterValue>;
        const { parameters } = block;
        for (const key of Object.getOwnPropertyNames(parameters)) {
            const parameter = parameters[key];
            values[key] = objectClone(parameter);
        }

        return values;
    });
    const [parameterValues, setParameterValues] = useState(originalValues);

    const updateParameterValue = (blockIndex: number, parameterKey: string, value: unknown) => {
        const newValues = parameterValues;
        newValues[blockIndex][parameterKey].value = value as string | number | boolean;
        setParameterValues(newValues);

        // Call after parameter is updates
        parameterUpdateCallback(blocks, parameterValues);
    };

    return (
        <>
            <Blocks blocks={blocks} updateParameterValue={updateParameterValue}></Blocks>
        </>
    );
}
