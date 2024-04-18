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

const exampleCodeBlockNumber: CodeTemplateBlock = {
    description: "log number value {{exampleNumber}} to the console",
    parameters: {
        exampleNumber: {
            name: "exampleNumber",
            description: "An example number parameter",
            type: "number",
            value: 0,
        },
    },
    template: `console.log({{exampleNumber}});`,
};

const exampleCodeBlockMixed: CodeTemplateBlock = {
    description: "log {{exampleBoolean}} {{exampleString}} {{exampleNumber}} to the console",
    parameters: {
        exampleBoolean: {
            name: "exampleBoolean",
            description: "An example boolean parameter",
            type: "boolean",
            value: false,
        },
        exampleString: {
            name: "exampleString",
            description: "An example string parameter",
            type: "string",
            value: "",
        },
        exampleNumber: {
            name: "exampleNumber",
            description: "An example number parameter",
            type: "number",
            value: 0,
        },
    },
    template: `
    console.log({{exampleBoolean}});
    console.log({{exampleString}});
    console.log({{exampleNumber}});`,
};

export const exampleCodeBlocks: CodeTemplateBlock[] = [
    exampleCodeBlockBoolean,
    exampleCodeBlockBooleanMultiple,
    exampleCodeBlockString,
    exampleCodeBlockNumber,
    exampleCodeBlockMixed,
];
