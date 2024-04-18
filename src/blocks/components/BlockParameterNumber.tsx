import React from "react";
import { Text, Tooltip, Input } from "@fluentui/react-components";
import { CodeTemplateBlockParameter } from "../CodeTemplateBlock";

export function BlockParameterNumber({
    name,
    description,
    updateValue,
}: Pick<CodeTemplateBlockParameter, "name" | "description"> & { updateValue: (value: number) => void }) {
    const [current, setCurrent] = React.useState(0);
    const onChange = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            const value = ev.currentTarget.value;
            const numberValue = parseFloat(value);
            setCurrent(numberValue);
            updateValue(numberValue);
        },
        [setCurrent]
    );

    return (
        <>
            <Text>{name}</Text>
            <Tooltip content={`${description}`} relationship="label">
                <Input aria-label={description} type="number" value={current.toString()} onChange={onChange} />
            </Tooltip>
        </>
    );
}
