import { Snip } from "./Snip";

export const defaultSnip: Snip = {
    name: "Default Snip",
    files: {
        typescript: {
            content: "function x() {\n\tconsole.log('Hello world!');\n}",
            language: "typescript",
        },
        html: {
            content: "<h1>Hello world!</h1>",
            language: "html",
        },
        css: {
            content: "h1 { color: red; }",
            language: "css",
        },
        libraries: {
            content:
                "https://appsforoffice.microsoft.com/lib/1/hosted/office.js\nhttps://appsforoffice.microsoft.com/lib/1/hosted/office.d.ts",
            language: "text",
        },
    },
};
