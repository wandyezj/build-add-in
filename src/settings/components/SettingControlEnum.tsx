import React from "react";
import { Text, Tooltip, Dropdown, Option, SelectionEvents, OptionOnSelectData } from "@fluentui/react-components";
import { Setting } from "./Setting";

export function SettingControlEnum({
    name,
    description,
    initialValue,
    updateValue,
    enumValues,
}: Pick<Setting, "name" | "description"> & {
    initialValue: string;
    updateValue: (value: string) => void;
    enumValues: Record<string, string>;
}) {
    const [current, setCurrent] = React.useState(initialValue);
    const onChange = React.useCallback(
        (event: SelectionEvents, data: OptionOnSelectData) => {
            // We only allow selection of one option at a time
            const value = data.optionValue!;
            console.log("value", value);
            setCurrent(value);
            updateValue(value);
        },
        [setCurrent]
    );

    return (
        <>
            <Text>{name}</Text>
            <Tooltip content={`${description}`} relationship="label">
                <Dropdown value={current} selectedOptions={[current]} onOptionSelect={onChange}>
                    {Object.entries(enumValues).map(([key, value]) => (
                        <Option key={key} value={key}>
                            {value}
                        </Option>
                    ))}
                </Dropdown>
            </Tooltip>
        </>
    );
}
