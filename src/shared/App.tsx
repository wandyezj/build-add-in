import React, { useEffect, useState } from "react";
import {
    Button,
    Dropdown,
    FluentProvider,
    webLightTheme,
    Option,
    Label,
    makeStyles,
    useId,
} from "@fluentui/react-components";
import { run } from "./run";
import { getAllSnipMetadata } from "../core/source/embedSnip";
import { SnipMetadata } from "../core/Snip";
import { getStartupSnipId, saveStartupSnipId } from "../core/source/embedSingleStartupSnip";

const useStyles = makeStyles({
    field: {
        display: "grid",
        justifyItems: "start",
    },
});

/**
 * The top level application component.
 */
export function App() {
    // all options
    const [snips, setSnips] = useState([] as SnipMetadata[]);

    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([] as string[]);
    const [value, setValue] = React.useState("");

    function updateSelectedOption(id: string | undefined) {
        if (id === undefined) {
            setSelectedOptions([]);
            setValue("");
            return;
        }

        const option = snips.find((value) => value.id === id);
        if (option === undefined) {
            setSelectedOptions([]);
            setValue("");
            return;
        }

        setSelectedOptions([option.name]);
        setValue(option.id);
    }

    async function reload() {
        const snips = await getAllSnipMetadata();
        console.log(
            snips
                .map(({ id, name }) => {
                    return `${id}\n${name}`;
                })
                .join("\n\n")
        );
        setSnips(snips);

        const id = await getStartupSnipId();

        console.log(`selected id:\n${id}`);
        updateSelectedOption(id);
    }

    useEffect(() => {
        reload();
    }, []);

    const dropdownId = useId("dropdown-select-startup-snip");
    const styles = useStyles();

    // Load all embedded snips
    // Allow selection of which snip to consider the startup snip

    return (
        <FluentProvider theme={webLightTheme}>
            <h1> Startup Snip </h1>
            <Label htmlFor={dropdownId} className={styles.field}>
                {" "}
                Select snip embedded in the document
            </Label>
            <Dropdown
                id={dropdownId}
                //placeholder="Select Startup Snip"
                value={value}
                selectedOptions={selectedOptions}
                onOptionSelect={(event, data) => {
                    const id = data.optionValue;

                    console.log(`onOptionSelect ${id}`);
                    if (id) {
                        saveStartupSnipId({ id: "", snipId: id });
                    }
                    setSelectedOptions(data.selectedOptions);
                    setValue(data.optionText ?? "");
                }}
                defaultChecked={true}

                // defaultValue={value}
                // defaultSelectedOptions={selectedOptions}
            >
                {snips.map((snip) => (
                    <Option key={snip.id} value={snip.id}>
                        {snip.name}
                    </Option>
                ))}
            </Dropdown>
            <br></br>
            <br></br>
            <Button onClick={run}>Start</Button>
        </FluentProvider>
    );
}
