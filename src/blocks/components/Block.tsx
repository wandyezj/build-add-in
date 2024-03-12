import React from "react";

import { Text, Card, CardHeader } from "@fluentui/react-components";
import { CodeTemplateBlock, getDescriptionPieces } from "../CodeTemplateBlock";
import { BlockParameter } from "./BlockParameter";

export function Block({
    block,
    updateParameterValue,
}: {
    block: CodeTemplateBlock;
    updateParameterValue: (parameterKey: string, value: unknown) => void;
}) {
    const { description, parameters } = block;

    const pieces = getDescriptionPieces(description);
    console.log(pieces);
    const pieceParts = pieces.map((piece, index) => {
        if (piece.type === "text") {
            return <Text key={index}>{piece.value}</Text>;
        }
        const parameter = parameters[piece.value];
        const updateValue = (value: unknown) => {
            updateParameterValue(piece.value, value);
        };

        return <BlockParameter key={index} parameter={parameter} updateValue={updateValue} />;
    });

    return (
        <Card orientation="horizontal">
            <CardHeader header={pieceParts} />
        </Card>
    );
}
