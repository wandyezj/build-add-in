import React from "react";
import { Text, Tooltip, Input } from "@fluentui/react-components";
import { CodeTemplateBlockParameter } from "../CodeTemplateBlock";

export function BlockParameterString({
    name,
    description,
    initialValue,
    updateValue,
}: Pick<CodeTemplateBlockParameter, "name" | "description"> & {
    initialValue: string;
    updateValue: (value: string) => void;
}) {
    const [current, setCurrent] = React.useState(initialValue);
    const onChange = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            const value = ev.currentTarget.value;
            setCurrent(value);
            updateValue(value);
        },
        [setCurrent]
    );

    return (
        <>
            <Text>{name}</Text>
            <Tooltip content={`${description}`} relationship="label">
                <Input aria-label={description} type="text" value={current} onChange={onChange} />
            </Tooltip>
        </>
    );
}
