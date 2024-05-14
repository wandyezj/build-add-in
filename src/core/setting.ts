import { objectClone } from "./objectClone";
import { loadSettings, saveSettings } from "./storage";

/**
 * All of the settings.
 */
export const settingsMetadata = {
    enableEmbed: {
        name: "Enable Embed",
        type: "boolean",
        defaultValue: true,
    } as SettingBoolean,

    /**
     * Show the run button on the edit page.
     */
    enableEditRun: {
        name: "Enable Edit Run",
        type: "boolean",
        defaultValue: true,
    } as SettingBoolean,

    test: {
        name: "test",
        type: "string",
        defaultValue: "",
    } as SettingString,
};
Object.freeze(settingsMetadata);

type SettingsMetadata = typeof settingsMetadata;
export type SettingsKey = keyof SettingsMetadata;

/**
 * setting name -> setting type
 */
export type Settings = { [key in SettingsKey]: (typeof settingsMetadata)[key]["defaultValue"] };

const settingsDefaults = (Object.getOwnPropertyNames(settingsMetadata) as SettingsKey[]).reduce((defaults, key) => {
    defaults = {
        ...defaults,
        [key]: settingsMetadata[key].defaultValue,
    };
    return defaults;
}, {} as Partial<Settings>) as Settings;

export function parseSettingsJson(value: string): Settings {
    try {
        const settingsValue = JSON.parse(value);

        if (typeof settingsValue === "object") {
            const settings: Settings = Object.getOwnPropertyNames(settingsDefaults).reduce((previous, key) => {
                // TODO: validation on settings
                // Only allow keys that have defaults
                const newObject = {
                    ...previous,
                    [key]: settingsValue[key],
                };

                return newObject;
            }, objectClone(settingsDefaults));

            return settings;
        }
    } catch {
        // Invalid - simply ignore
    }

    return settingsDefaults;
}

interface Setting {
    name: string;
}

type SettingBoolean = Readonly<Setting & SettingValueBoolean>;

type SettingString = Readonly<Setting & SettingValueString>;

interface SettingValueBoolean {
    type: "boolean";
    defaultValue: boolean;
}

interface SettingValueString {
    type: "string";
    defaultValue: string;
}

export function getSettingsMetadata(): Readonly<SettingsMetadata> {
    return settingsMetadata;
}

export function getSettings(): Settings {
    const settings = loadSettings();
    return settings;
}

export function setSetting(settings: Settings) {
    saveSettings(settings);
}

export function getSetting<T extends SettingsKey>(name: T): Settings[T] {
    const settings = getSettings();
    return settings[name];
}
