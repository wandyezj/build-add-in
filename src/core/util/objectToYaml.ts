import yaml from "yaml";

export function objectToYaml(object: object): string {
    return yaml.stringify(object, {
        // Use 4 spaces for indentation
        indent: 4,

        // No line width limit
        lineWidth: 0,

        // Use plain style for scalars
        defaultStringType: yaml.Scalar.PLAIN,
    });
}
