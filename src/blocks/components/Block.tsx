import React from "react";

import { Text, Card, CardHeader, Switch, Tooltip, makeStyles } from "@fluentui/react-components";
import { CodeTemplateBlock, CodeTemplateBlockParameter, getDescriptionPieces } from "../CodeTemplateBlock";

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

export function BlockParameter({
    parameter,
    updateValue,
}: {
    parameter: CodeTemplateBlockParameter;
    updateValue: (value: unknown) => void;
}) {
    const { name, description, type } = parameter;

    if (type === "boolean") {
        return <BlockParameterBoolean name={name} description={description} updateValue={updateValue} />;
    }
    return <div> Unknown Parameter</div>;
}

const useStyles = makeStyles({
    text: {
        paddingLeft: "10px",
        paddingRight: "10px",
    },
});

export function BlockParameterBoolean({
    name,
    description,
    updateValue,
}: Pick<CodeTemplateBlockParameter, "name" | "description"> & { updateValue: (value: boolean) => void }) {
    const styles = useStyles();
    const [checked, setChecked] = React.useState(true);
    const onChange = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            const value = ev.currentTarget.checked;
            setChecked(value);
            updateValue(value);
        },
        [setChecked]
    );

    return (
        <>
            <div className={styles.text}>
                <Text>{name}</Text>
                <Tooltip content={`${description}: ${checked ? "True" : "False"}`} relationship="label">
                    <Switch checked={checked} onChange={onChange} />
                </Tooltip>
            </div>
        </>
    );
}
