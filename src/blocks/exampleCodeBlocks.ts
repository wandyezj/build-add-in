import { CodeTemplateBlock } from "./CodeTemplateBlock";

const exampleCodeBlockBoolean: CodeTemplateBlock = {
    description: "log boolean value {{exampleBoolean}} to the console",
    parameters: {
        exampleBoolean: {
            name: "exampleBoolean",
            description: "An example boolean parameter",
            type: "boolean",
            value: true,
        },
    },
    template: `console.log({{exampleBoolean}});`,
};

const exampleCodeBlockBooleanMultiple: CodeTemplateBlock = {
    description: "log booleans {{one}} and {{two}} to the console",
    parameters: {
        one: {
            name: "name one",
            description: "Boolean one",
            type: "boolean",
            value: true,
        },
        two: {
            name: "name two",
            description: "Boolean two",
            type: "boolean",
            value: false,
        },
    },
    template: `console.log({{one}});
    console.log({{two}});
    `,
};

const exampleCodeBlockString: CodeTemplateBlock = {
    description: "log string value {{exampleString}} to the console",
    parameters: {
        exampleString: {
            name: "exampleString",
            description: "An example string parameter",
            type: "string",
            value: "",
        },
    },
    template: `console.log({{exampleString}});`,
};

export const exampleCodeBlocks: CodeTemplateBlock[] = [
    exampleCodeBlockBoolean,
    exampleCodeBlockBooleanMultiple,
    exampleCodeBlockString,
];
