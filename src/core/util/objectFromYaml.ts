import yaml from "yaml";

export function objectFromYaml<T extends object>(text: string): T {
    return yaml.parse(text);
}
