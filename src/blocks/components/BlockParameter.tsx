import React from "react";
import { CodeTemplateBlockParameter } from "../CodeTemplateBlock";
import { BlockParameterBoolean } from "./BlockParameterBoolean";
import { makeStyles } from "@fluentui/react-components";
import { BlockParameterString } from "./BlockParameterString";

const useStyles = makeStyles({
    text: {
        paddingLeft: "10px",
        paddingRight: "10px",
    },
});

export function BlockParameter({
    parameter,
    updateValue,
}: {
    parameter: CodeTemplateBlockParameter;
    updateValue: (value: unknown) => void;
}) {
    const styles = useStyles();
    const { name, description, type } = parameter;

    if (type === "boolean") {
        return (
            <div className={styles.text}>
                <BlockParameterBoolean name={name} description={description} updateValue={updateValue} />
            </div>
        );
    }
    if (type === "string") {
        return (
            <div className={styles.text}>
                <BlockParameterString name={name} description={description} updateValue={updateValue} />
            </div>
        );
    }
    return <div> Unknown Parameter</div>;
}
