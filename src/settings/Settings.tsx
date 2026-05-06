import React, { useState } from "react";
import { SettingsKey, getSetting, getSettings, getSettingsMetadata } from "../core/setting";
import { SettingControl } from "./components/SettingControl";
import { saveSettings } from "../core/storage";
import { Setting } from "./components/Setting";
import { showControlPanel } from "../core/settings/showControlPanel";

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

    const metadata = getSettingsMetadata();

    const metadataSettings = Object.getOwnPropertyNames(metadata).map((property) => {
        const key = property as SettingsKey;
        const setting = metadata[key];
        return { key, setting };
    });

    const settingsVisible = metadataSettings.filter(({ setting }) => setting.visible);

    // All the settings that should be shown.
    const settingsShown = settingsVisible;

    // If control panel is enabled then show additional settings.
    if (showControlPanel()) {
        const settingsControlPanel = metadataSettings.filter(({ setting }) => !setting.visible);

        settingsShown.push(...settingsControlPanel);
    }

    const settingParameters = settingsShown
        .map(({ key, setting }) => {
            const value = getSetting(key);

            const parameter = {
                name: setting.name,
                type: setting.type,
                value,
                description: setting.tooltip || "",
                metadata: setting.metadata,
            } as Setting;
            return { key, parameter };
        })
        .filter((setting) => ["boolean", "string", "enum"].includes(setting.parameter.type));

    return settingParameters.map(({ parameter, key }) => (
        <SettingControl
            key={key}
            parameter={parameter}
            updateValue={(value) => {
                updateSetting(key, value);
            }}
        />
    ));
}
