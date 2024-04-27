interface Setting {
    name: string;
    value: SettingValue;
}

interface SettingBoolean extends Setting {
    value: SettingValueBoolean;
}

interface SettingString extends Setting {
    value: SettingValueString;
}

type SettingValue = SettingValueBoolean | SettingValueString;

interface SettingValueBoolean {
    type: "boolean";
    defaultValue: boolean;
}

interface SettingValueString {
    type: "string";
    defaultValue: string;
}

const settings = {
    enableEmbed: {
        name: "Enable Embed",
        value: {
            type: "boolean",
            defaultValue: true,
        },
    } as SettingBoolean,

    test: {
        name: "test",
        value: {
            type: "string",
            defaultValue: "",
        },
    } as SettingString,
};

type SettingKey = keyof typeof settings;

export function getSettings(): string {
    return "";
}

export function setSetting() {}
