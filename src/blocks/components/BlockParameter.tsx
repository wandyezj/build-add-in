import React from "react";
import { BlockParameterBoolean } from "./BlockParameterBoolean";
import { makeStyles } from "@fluentui/react-components";
import { BlockParameterString } from "./BlockParameterString";
import { BlockParameterNumber } from "./BlockParameterNumber";
import { BlockParameterEnum } from "./BlockParameterEnum";
import { CodeTemplateBlockParameter } from "../CodeTemplateBlock";

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
    const { name, description, type, value } = parameter;

    switch (type) {
        case "number":
            return (
                <div className={styles.text}>
                    <BlockParameterNumber
                        name={name}
                        description={description}
                        initialValue={value}
                        updateValue={updateValue}
                    />
                </div>
            );
        case "boolean":
            return (
                <div className={styles.text}>
                    <BlockParameterBoolean
                        name={name}
                        description={description}
                        initialValue={value}
                        updateValue={updateValue}
                    />
                </div>
            );
        case "string":
            return (
                <div className={styles.text}>
                    <BlockParameterString
                        name={name}
                        description={description}
                        initialValue={value}
                        updateValue={updateValue}
                    />
                </div>
            );
        case "enum":
            return (
                <div className={styles.text}>
                    <BlockParameterEnum
                        name={name}
                        description={description}
                        initialValue={value}
                        updateValue={updateValue}
                        enumValues={parameter.metadata.enumValues}
                    />
                </div>
            );
        default:
            return <div> Unknown Parameter</div>;
    }
}
