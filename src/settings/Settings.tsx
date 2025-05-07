import React, { useState } from "react";
import { SettingsKey, getSetting, getSettings, getSettingsMetadata } from "../core/setting";
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

            const value = getSetting(key);

            const parameter = {
                name: setting.name,
                type: setting.type,
                value,
                description: setting.tooltip || "",
                metadata: setting.metadata,
            } as CodeTemplateBlockParameter;
            return { key, parameter };
        })
        .filter((setting) => ["boolean", "string", "enum"].includes(setting.parameter.type));

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
