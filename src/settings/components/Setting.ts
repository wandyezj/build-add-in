/*
Settings Types

Type definitions for settings values and metadata used by settings components.
*/

export type SettingType = "string" | "number" | "boolean" | "enum";

export type SettingValue = SettingValueString | SettingValueNumber | SettingValueBoolean | SettingValueEnum<string>;

export interface SettingValueString {
    type: "string";
    value: string;
}

export interface SettingValueNumber {
    type: "number";
    value: number;
}

export interface SettingValueBoolean {
    type: "boolean";
    value: boolean;
}

export interface SettingValueEnum<T> {
    type: "enum";
    value: T;
    metadata: {
        enumValues: Record<T & string, string>;
    };
}

export type Setting = {
    /**
     * display name for the parameter
     */
    name: string;
    description: string;
    metadata?: unknown;
} & SettingValue;
