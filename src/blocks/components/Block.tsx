import React from "react";

import { Text, Card, CardHeader, Switch, Tooltip, makeStyles } from "@fluentui/react-components";
import { CodeTemplateBlock, CodeTemplateBlockParameter, getDescriptionPieces } from "../CodeTemplateBlock";

export function Block({ block }: { block: CodeTemplateBlock }) {
    const { description, parameters } = block;

    // const blockParameters = parameters.map((parameter) => {
    //     return <BlockParameter parameter={parameter} />;
    // });

    const pieces = getDescriptionPieces(description);
    console.log(pieces);
    const pieceParts = pieces.map((piece) => {
        if (piece.type === "text") {
            return <Text>{piece.value}</Text>;
        }
        const parameter = parameters[piece.value];
        return <BlockParameter parameter={parameter} />;
    });

    return (
        <Card orientation="horizontal">
            <CardHeader header={pieceParts} />
        </Card>
    );
}

export function BlockParameter({ parameter }: { parameter: CodeTemplateBlockParameter }) {
    const { name, description, type } = parameter;

    if (type === "boolean") {
        return <BlockParameterBoolean name={name} description={description} />;
    }
    return <div> Unknown Parameter</div>;
}

const useStyles = makeStyles({
    text: {
        paddingLeft: "10px",
        paddingRight: "10px",
    },
});

export function BlockParameterBoolean({ name, description }: Pick<CodeTemplateBlockParameter, "name" | "description">) {
    const styles = useStyles();
    const [checked, setChecked] = React.useState(true);
    const onChange = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            setChecked(ev.currentTarget.checked);
        },
        [setChecked]
    );

    return (
        <>
            <div className={styles.text}>
                <Text>{name}</Text>
                <Tooltip content={`${description}\n${checked ? "True" : "False"}`} relationship="label">
                    <Switch checked={checked} onChange={onChange} />
                </Tooltip>
            </div>
        </>
    );
}
