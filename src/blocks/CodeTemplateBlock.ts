/*
Code Template Block

A template to generate a block of code.


display description
parameters
    - name in the description
string template.


*/

export interface CodeTemplateBlock {
    /**
     * display description for the block
     */
    description: string;
    /**
     * TODO: make this a record key -> parameter
     */
    parameters: Record<string, CodeTemplateBlockParameter>;
    /**
     * template for the block to insert the parameter values into
     */
    template: string;
}

export type CodeTemplateBlockParameterType = "string" | "number" | "boolean" | "enum";

export type CodeTemplateBlockParameterValue =
    | CodeTemplateBlockParameterValueString
    | CodeTemplateBlockParameterValueNumber
    | CodeTemplateBlockParameterValueBoolean
    | CodeTemplateBlockParameterValueEnum<string>;

export interface CodeTemplateBlockParameterValueString {
    type: "string";
    value: string;
}

export interface CodeTemplateBlockParameterValueNumber {
    type: "number";
    value: number;
}

export interface CodeTemplateBlockParameterValueBoolean {
    type: "boolean";
    value: boolean;
}

export interface CodeTemplateBlockParameterValueEnum<T> {
    type: "enum";
    value: T;
    metadata: {
        enumValues: Record<T & string, string>;
    };
}

export type CodeTemplateBlockParameter = {
    /**
     * display name for the parameter
     */
    name: string;
    description: string;
    metadata?: unknown;
} & CodeTemplateBlockParameterValue;

export function getFilledTemplate(
    template: string,
    parameters: Record<string, CodeTemplateBlockParameterValue>
): string {
    let filledTemplate = template;
    for (const key of Object.getOwnPropertyNames(parameters)) {
        const { type, value } = parameters[key];

        let replaceValue = "/* unknown */";
        // determine how the value should be formatted for replacement
        switch (type) {
            case "number":
            case "boolean":
                replaceValue = value.toString();
                break;
            case "string":
                // TODO: make sure this can't be escaped
                replaceValue = `"${value.replaceAll('"', '\\"')}"`;
                break;
            default:
                break;
        }

        // replace all keys with the value
        filledTemplate = filledTemplate.replaceAll(`{{${key}}}`, replaceValue);
    }

    return filledTemplate;
}

export type DescriptionPiece = {
    type: "text" | "parameter";
    value: string;
};

const templateDelimiterKeyBegin = "{{";
const templateDelimiterKeyEnd = "}}";

/**
 * Break up description into text pieces and parameter pieces in order.
 * @param description
 * @returns
 */
export function getDescriptionPieces(description: string): DescriptionPiece[] {
    const pieces: DescriptionPiece[] = description
        .split(templateDelimiterKeyBegin)
        .map((part) => {
            if (part.includes(templateDelimiterKeyEnd)) {
                const [name, text] = part.split(templateDelimiterKeyEnd);
                return [
                    {
                        type: "parameter",
                        value: name,
                    },
                    {
                        type: "text",
                        value: text,
                    },
                ];
            }
            return {
                type: "text",
                value: part,
            };
        })
        .flat() as DescriptionPiece[];
    return pieces;
}
