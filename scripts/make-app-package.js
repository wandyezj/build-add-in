// Create a unified zip file
// https://learn.microsoft.com/en-us/office/dev/add-ins/testing/sideload-add-in-with-unified-manifest#manually-create-the-add-in-package-file

const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

const parameters = process.argv.slice(2);

if (parameters.length !== 2) {
    console.log("usage: [manifest.json] [output directory relative to root]");
    process.exit(0);
}

const [manifestPath, outputDirectoryRelative] = parameters;

const root = path.resolve(__dirname, "..");
console.log(root);
const outputDirectory = path.join(root, outputDirectoryRelative);

// Read manifest
const manifestText = fs.readFileSync(manifestPath, "utf8");

/**
 * @type {{icons: { outline: string; color: string;}}}
 */
const manifest = JSON.parse(manifestText);

// Read "icons" property
const icons = [manifest.icons.color, manifest.icons.outline];

// Create Temp Directory
const tempName = fs.mkdtempSync("temp-");
const tempPath = path.join(root, tempName);
console.log(tempPath);

// Copy files to temp zip directory
const fromPath = manifestPath;
const toPath = path.join(tempPath, "manifest.json");
fs.copyFileSync(fromPath, toPath);

icons.forEach((iconPath) => {
    const fromPath = path.join(root, iconPath);
    const toPath = path.join(tempPath, iconPath);
    fs.mkdirSync(path.dirname(toPath), { recursive: true });
    fs.copyFileSync(fromPath, toPath);
});

// Create Zip File
const zipPathIn = tempPath;
const zipPathOut = path.normalize(path.join(outputDirectory, "appPackage.zip"));
if (fs.existsSync(zipPathOut)) {
    fs.rmSync(zipPathOut);
}

const files = fs.readdirSync(zipPathIn);
const command = `tar.exe --auto-compress --create --verbose --file ${zipPathOut} ${files.join(" ")}`;
console.log(command);
child_process.execSync(command, { cwd: zipPathIn });

// Cleanup
fs.rmSync(tempPath, { recursive: true, force: true });
