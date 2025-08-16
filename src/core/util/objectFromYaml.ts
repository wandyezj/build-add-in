import yaml from "yaml";

export function objectFromYaml(text: string): object {
    return yaml.parse(text);
}
