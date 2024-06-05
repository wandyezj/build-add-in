import React from "react";
import { Text, Switch, Tooltip } from "@fluentui/react-components";
import { CodeTemplateBlockParameter } from "../CodeTemplateBlock";

export function BlockParameterBoolean({
    name,
    description,
    initialValue,
    updateValue,
}: Pick<CodeTemplateBlockParameter, "name" | "description"> & {
    initialValue: boolean;
    updateValue: (value: boolean) => void;
}) {
    const [checked, setChecked] = React.useState(initialValue);
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
            <Text>{name}</Text>
            <Tooltip content={`${description}: ${checked ? "True" : "False"}`} relationship="label">
                <Switch checked={checked} onChange={onChange} />
            </Tooltip>
        </>
    );
}
