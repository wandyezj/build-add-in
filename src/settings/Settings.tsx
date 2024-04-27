import React, { useState } from "react";
import { SettingsKey, getSettings, getSettingsMetadata } from "../core/setting";
import { BlockParameter } from "../blocks/components/BlockParameter";
import { saveSettings } from "../core/storage";

export function Settings() {
    const [settings, setSettings] = useState(getSettings());

    function updateSetting(name: SettingsKey, value: unknown) {
        const newSettings = {
            ...settings,
            [name]: value,
        };
        setSettings(newSettings);
        saveSettings(newSettings);
    }

    // Use Blocks for settings
    //<Blocks></Blocks>
    const metadata = getSettingsMetadata();
    const setting = metadata.enableEmbed;
    const parameter = {
        name: setting.name,
        type: setting.type,
        description: "",
    };

    return (
        <BlockParameter
            parameter={parameter}
            updateValue={(value) => {
                updateSetting("enableEmbed", value);
            }}
        />
    );
}
