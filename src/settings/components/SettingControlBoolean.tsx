import React from "react";
import { Text, Switch, Tooltip } from "@fluentui/react-components";
import { Setting } from "./Setting";

export function SettingControlBoolean({
    name,
    description,
    initialValue,
    updateValue,
}: Pick<Setting, "name" | "description"> & {
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

    const hasDescription = typeof description === "string" && description.length > 0;
    return (
        <>
            <Text>{name}</Text>
            <Tooltip content={`${description}${hasDescription ? " " : " "}${format(checked, hasDescription)}`} relationship="label">
                <Switch checked={checked} onChange={onChange} />
            </Tooltip>
        </>
    );
}

function format(value: boolean, embrace: boolean) : string {
    const text = value ? "True" : "False";
    return embrace ? `(${text})` : text;
}