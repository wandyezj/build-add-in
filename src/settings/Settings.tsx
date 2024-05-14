import React, { useState } from "react";
import { SettingsKey, getSettings, getSettingsMetadata } from "../core/setting";
import { BlockParameter } from "../blocks/components/BlockParameter";
import { saveSettings } from "../core/storage";
import { CodeTemplateBlockParameter } from "../blocks/CodeTemplateBlock";

export function Settings() {
    const [settings, setSettings] = useState(getSettings());

    function updateSetting(name: SettingsKey, value: unknown) {
        const newSettings = {
            ...settings,
            [name]: value,
        };
        saveSettings(newSettings);
        setSettings(newSettings);
    }

    // Use Blocks for settings
    //<Blocks></Blocks>
    const metadata = getSettingsMetadata();

    const settingParameters = Object.getOwnPropertyNames(metadata)
        .map((property) => {
            const key = property as SettingsKey;
            const setting = metadata[key];
            const parameter = {
                name: setting.name,
                type: setting.type,
                value: settings[key],
                description: "",
            } as CodeTemplateBlockParameter;
            return { key, parameter };
        })
        .filter((setting) => setting.parameter.type === "boolean");

    return settingParameters.map(({ parameter, key }) => (
        <BlockParameter
            key={key}
            parameter={parameter}
            updateValue={(value) => {
                updateSetting(key, value);
            }}
        />
    ));
}
