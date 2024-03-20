import * as ts from "typescript";

/**
 * Create a single file TypeScript program that works in the browser.
 */
function createProgramFromFiles(
    files: { name: string; data: string }[],
    {
        intellisense,
        options,
    }: {
        intellisense?: string[];
        options?: ts.CompilerOptions;
    }
): ts.Program {
    const defaultLibFileName = "lib.d.ts";
    const defaultLibData = (intellisense || [""]).join("\n\n");

    const fileNames = files.map((file) => file.name);
    const fileNameData: [string, string][] = files.map(({ name, data }) => [name, data]);
    fileNameData.push([defaultLibFileName, defaultLibData]);
    const fileMap = new Map<string, string>(fileNameData);

    const host: ts.CompilerHost = {
        getSourceFile: (
            fileName: string,
            languageVersion: ts.ScriptTarget /*onError?: (message: string) => void */
        ) => {
            const data = fileMap.get(fileName);
            if (data === undefined) {
                return undefined;
            }

            return ts.createSourceFile(fileName, data, languageVersion, true);
        },
        getDefaultLibFileName: (defaultLibOptions: ts.CompilerOptions) =>
            "/" + ts.getDefaultLibFileName(defaultLibOptions),
        writeFile: () => {}, // do nothing
        getCurrentDirectory: () => "/",
        getDirectories: (/*path: string*/) => [],
        fileExists: (fileName: string) => {
            console.log(`fileExists ${fileName}`);
            return true; // all files exist
        },
        readFile: (fileName: string) => {
            console.log(`readfile ${fileName}`);
            return undefined; // don't need to read files
        },
        getCanonicalFileName: (fileName: string) => fileName,
        useCaseSensitiveFileNames: () => true,
        getNewLine: () => "\n",
        getEnvironmentVariable: () => "", // do nothing
    };

    const program = ts.createProgram({
        rootNames: fileNames,
        options: {
            ...options,
            lib: [defaultLibFileName],
        },
        host,
    });

    return program;
}

function createProgram(code: string) {
    const target = ts.ScriptTarget.ES2022;
    const lib = ["dom", "es2022"];

    const options: ts.CompilerOptions = {
        target,
        lib,
        module: ts.ModuleKind.None,
        strict: true,
        noEmit: true,
        inlineSourceMap: true,
        inlineSources: true,
    };

    const files = [{ name: "code.ts", data: code }];
    const program = createProgramFromFiles(files, { options });
    return program;
}

// function simpleCompile(code: string): string {
//     console.log("compileCode");
//     console.log(code);
//     const target = ts.ScriptTarget.ES2022;
//     const lib = ["dom", "es2022"];

//     const compilerOptions: ts.CompilerOptions = {
//         target,
//         lib,
//         module: ts.ModuleKind.None,
//         strict: true,
//         noEmit: true,
//         inlineSourceMap: true,
//         inlineSources: true,
//     };

//     // https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#a-minimal-compiler
//     // TODO: get pre emit diagnostics
//     // ts.getPreEmitDiagnostics(ts.createProgram(["file.ts"], compilerOptions));

//     // only used to get the js
//     const result = ts.transpileModule(code, {
//         // doesn't actually get all errors
//         reportDiagnostics: true,
//         compilerOptions,
//     });

//     const { diagnostics } = result;

//     let issues: { message: string }[] = [];
//     if (diagnostics) {
//         issues = diagnostics.map((diagnostic) => {
//             const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
//             return {
//                 message,
//             };
//         });
//     }

//     const js = result.outputText;
//     console.log(js);
//     return { issues, js };
// }

/**
 * Compile TypeScript code to JavaScript
 * @param code
 * @returns text code
 */
export function compileCode(code: string) {
    console.log("compileCode");
    console.log(code);

    const program = createProgram(code);

    let issues: { message: string }[] = [];
    const preDiagnostics = ts.getPreEmitDiagnostics(program);
    if (preDiagnostics) {
        issues = preDiagnostics.map((diagnostic) => {
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            return {
                message,
            };
        });
    }
    console.log(issues);

    const result = program.emit();
    console.log(result);

    const { diagnostics } = result;

    if (diagnostics) {
        issues = diagnostics.map((diagnostic) => {
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            return {
                message,
            };
        });
    }

    const js = result.emittedFiles?.[0] || "";
    console.log(js);
    return { issues, js };
}
