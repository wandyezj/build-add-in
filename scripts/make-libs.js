// Make TypeScript intellisense library from the typescript package.
// These are needed for the compiler

const fs = require("fs");
const path = require("path");

const nodeModulesDirectory = path.join(__dirname, "../node_modules");
const typescriptLibPath = path.join(nodeModulesDirectory, "typescript/lib");

const libFiles = fs.readdirSync(typescriptLibPath).filter((file) => file.endsWith(".d.ts"));
console.log(libFiles);

const fileToLib = new Map(
    libFiles.map((file) => {
        const lib = file.replace(".d.ts", "").replace("lib.", "");
        return [lib, file];
    })
);

console.log(fileToLib);

// should we just copy all the libs?

// which libs to include?

const includeLibs = ["es2023"];
console.log(includeLibs);
// need to resolve files in the lib directory
