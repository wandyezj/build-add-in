import React from "react";
import { CodeTemplateBlockParameter } from "../CodeTemplateBlock";
import { BlockParameterBoolean } from "./BlockParameterBoolean";
import { makeStyles } from "@fluentui/react-components";
import { BlockParameterString } from "./BlockParameterString";
import { BlockParameterNumber } from "./BlockParameterNumber";

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

    switch (type) {
        case "number":
            return (
                <div className={styles.text}>
                    <BlockParameterNumber name={name} description={description} updateValue={updateValue} />
                </div>
            );
        case "boolean":
            return (
                <div className={styles.text}>
                    <BlockParameterBoolean name={name} description={description} updateValue={updateValue} />
                </div>
            );
        case "string":
            return (
                <div className={styles.text}>
                    <BlockParameterString name={name} description={description} updateValue={updateValue} />
                </div>
            );
        default:
            return <div> Unknown Parameter</div>;
    }
}
