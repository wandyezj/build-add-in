import React from "react";
import { Text, Tooltip, Dropdown, Option, SelectionEvents, OptionOnSelectData } from "@fluentui/react-components";
import { CodeTemplateBlockParameter } from "../CodeTemplateBlock";

export function BlockParameterEnum({
    name,
    description,
    initialValue,
    updateValue,
    enumValues,
}: Pick<CodeTemplateBlockParameter, "name" | "description"> & {
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
