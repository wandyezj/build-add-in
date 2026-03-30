// Check for possible updates in the NPM package

// read the package.json file

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const root = path.join(__dirname, "..");

const packageJsonPath = path.join(root, "package.json");

const packageJsonText = fs.readFileSync(packageJsonPath, "utf-8");
const packageJson = JSON.parse(packageJsonText);

// read through the dependencies and devDependencies

function readDependencies(dependencies) {
    const entries = [];
    for (const [name, version] of Object.entries(dependencies)) {
        //console.log(`${name}: ${version}`);
        entries.push({ name, version });
    }
    return entries;
}

/**
 *
 * @param {{name: string; version:string}[]} packages
 */
function showUpdates(packages) {
    for (const { name, version } of packages) {
        const latestVersion = execSync(`npm view ${name} version`).toString().trim();

        const cleanVersion = version.replaceAll("^", "");

        if (cleanVersion !== latestVersion) {
            console.log(`
${name}
    ${version}
    ${latestVersion}`);
        } else {
            console.log(`
${name} [equal] ${version} ${latestVersion}`);
        }
    }
}

//const packages = [];
//packages.push(...readDependencies(packageJson.dependencies));
//packages.push(...readDependencies(packageJson.devDependencies));

// look up latest version on NPM

let packages = [];

console.log("Dependencies:");
console.log("");
packages = readDependencies(packageJson.dependencies);
showUpdates(packages);

console.log("");
console.log("DevDependencies:");
packages = readDependencies(packageJson.devDependencies);
showUpdates(packages);
