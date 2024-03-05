import * as ts from "typescript";

/**
 * Compile TypeScript code to JavaScript
 * @param code
 * @returns text code
 */
export function compileCode(code: string) {
    console.log("compileCode");
    console.log(code);
    const target = ts.ScriptTarget.ES2022;
    const lib = ["dom", "es2022"];

    const compilerOptions: ts.CompilerOptions = {
        target,
        lib,
        module: ts.ModuleKind.None,
        strict: true,
        noEmit: true,
        inlineSourceMap: true,
        inlineSources: true,
    };

    // TODO: get pre emit diagnostics
    // ts.getPreEmitDiagnostics(ts.createProgram(["file.ts"], compilerOptions));

    const result = ts.transpileModule(code, {
        reportDiagnostics: true,
        compilerOptions,
    });

    const { diagnostics } = result;

    let issues: { message: string }[] = [];
    if (diagnostics) {
        issues = diagnostics.map((diagnostic) => {
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            return {
                message,
            };
        });
    }

    const js = result.outputText;
    console.log(js);
    return { issues, js };
}
