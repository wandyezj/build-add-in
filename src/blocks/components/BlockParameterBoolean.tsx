import React from "react";
import { Text, Switch, Tooltip, makeStyles } from "@fluentui/react-components";
import { CodeTemplateBlockParameter } from "../CodeTemplateBlock";

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
