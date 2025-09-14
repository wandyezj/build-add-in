import { objectClone } from "./util/objectClone";
import { loadSettings, saveSettings } from "./storage";
import { Language } from "./localize/Language";
import { Theme } from "./settings/Theme";
import { SnipExportFormat } from "./settings/SnipExportFormat";

/**
 * Returns an object with keys and values from the enum.
 * The keys are the same as the enum values.
 */
function getEnumValues<T>(enumObject: Record<string, T>): { [k: string]: T } {
    return Object.fromEntries(Object.values(enumObject).map((v) => [v, v]));
}

/**
 * All of the settings.
 */
export const settingsMetadata = {
    /**
     * Show the GitHub button in the open menu.
     */
    githubPersonalAccessToken: {
        name: "GitHub Personal Access Token",
        tooltip: `Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens -> Generate new token
        Account Permissions:
        Gists Read and Write`,
        type: "string",
        defaultValue: "",
    } as SettingString,

    theme: {
        name: "Theme",
        tooltip: "Theme to use for the editor.",
        type: "enum",
        defaultValue: Theme.Default,

        metadata: {
            enumValues: getEnumValues(Theme),
        },
    } as SettingEnum<Theme>,

    /**
     * Show in run console.log in inline text.
     */
    enableRunInlineConsole: {
        name: "Enable Run Inline Console",
        tooltip: "Useful for simple debugging without F12",
        type: "boolean",
        defaultValue: true,
    } as SettingBoolean,

    enableHostSpecificNewSnip: {
        name: "Enable Host Specific New Snip",
        type: "boolean",
        tooltip: "Use a default snip tailored to each host.",
        defaultValue: true,
    } as SettingBoolean,

    /**
     * Show the samples in the open menu.
     */
    enableSamples: {
        name: "Enable Samples",
        type: "boolean",
        defaultValue: false,
    } as SettingBoolean,

    /**
     * Show the embed button on the edit page and in the open menu.
     */
    enableEmbed: {
        name: "Enable Embed",
        type: "boolean",
        defaultValue: false,
    } as SettingBoolean,

    /**
     * Show the signature button on the edit page.
     * The button allows:
     * - viewing a snips embedded signature
     * - signing a snip with a GPG key tied to a GitHub account
     */
    enableSignature: {
        name: "Enable Signature",
        type: "boolean",
        tooltip: "Enable the signature button on the edit page.",
        defaultValue: false,
    } as SettingBoolean,

    /**
     * Show the run button on the edit page.
     */
    enableEditRun: {
        name: "Enable Edit Run",
        type: "boolean",
        defaultValue: true,
    } as SettingBoolean,

    /**
     * Show the import button on the edit page.
     */
    enableEditImport: {
        name: "Enable Edit Import",
        type: "boolean",
        defaultValue: false,
    } as SettingBoolean,

    snipExportFormat: {
        name: "Snip Export Format",
        tooltip: "Format to use when exporting snips.",
        type: "enum",
        defaultValue: SnipExportFormat.Json,

        metadata: {
            enumValues: getEnumValues(SnipExportFormat),
        },
    },

    language: {
        name: "Language",
        tooltip: "Language to use for the editor. Best effort AI translation.",
        type: "enum",
        defaultValue: Language.Default,

        metadata: {
            enumValues: getEnumValues(Language),
        },
    } as SettingEnum<Language>,
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
    tooltip?: string;
    metadata?: unknown;
}

type SettingBoolean = Readonly<Setting & SettingValueBoolean>;

type SettingString = Readonly<Setting & SettingValueString>;

type SettingEnum<T> = Readonly<Setting & SettingValueEnum<T>>;

interface SettingValueBoolean {
    type: "boolean";
    defaultValue: boolean;
}

interface SettingValueString {
    type: "string";
    defaultValue: string;
}

interface SettingValueEnum<T> {
    type: "enum";
    defaultValue: T;
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
