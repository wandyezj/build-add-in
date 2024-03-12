import { CodeTemplateBlock } from "./CodeTemplateBlock";

const exampleCodeBlockBoolean: CodeTemplateBlock = {
    description: "log boolean value {{exampleBoolean}} to the console",
    parameters: {
        exampleBoolean: {
            name: "exampleBoolean",
            description: "An example boolean parameter",
            type: "boolean",
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
        },
        two: {
            name: "name two",
            description: "Boolean two",

            type: "boolean",
        },
    },
    template: `console.log({{one}});
    console.log({{two}});
    `,
};

export const exampleCodeBlocks: CodeTemplateBlock[] = [exampleCodeBlockBoolean, exampleCodeBlockBooleanMultiple];
