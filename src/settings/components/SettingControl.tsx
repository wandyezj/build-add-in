import React from "react";
import { makeStyles } from "@fluentui/react-components";
import { SettingControlString } from "./SettingControlString";
import { SettingControlNumber } from "./SettingControlNumber";
import { SettingControlEnum } from "./SettingControlEnum";
import { SettingControlBoolean } from "./SettingControlBoolean";
import { Setting } from "./Setting";

const useStyles = makeStyles({
    text: {
        paddingLeft: "10px",
        paddingRight: "10px",
    },
});

export function SettingControl({
    parameter,
    updateValue,
}: {
    parameter: Setting;
    updateValue: (value: unknown) => void;
}) {
    const styles = useStyles();
    const { name, description, type, value } = parameter;

    switch (type) {
        case "number":
            return (
                <div className={styles.text}>
                    <SettingControlNumber
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
                    <SettingControlBoolean
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
                    <SettingControlString
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
                    <SettingControlEnum
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
