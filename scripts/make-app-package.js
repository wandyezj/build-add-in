// Create a unified zip file
// https://learn.microsoft.com/en-us/office/dev/add-ins/testing/sideload-add-in-with-unified-manifest#manually-create-the-add-in-package-file

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");

const isMac = "Darwin" === os.type();

const parameters = process.argv.slice(2);

if (![2, 3].includes(parameters.length)) {
    console.log("usage: [manifest.json] [output directory relative to root] [optional file name]");
    process.exit(0);
}

const [manifestPath, outputDirectoryRelative, outputFileName] = parameters;

const root = path.resolve(__dirname, "..");
console.log(root);
const outputDirectory = path.join(root, outputDirectoryRelative);

// Read manifest
const manifestText = fs.readFileSync(manifestPath, "utf8");

/**
 * @type {{icons: { outline: string; color: string;}; localizationInfo: {defaultLanguageTag: string; additionalLanguages?: {languageTag: string; file: string;}[];}}}
 */
const manifest = JSON.parse(manifestText);

// Read "icons" property
const icons = [manifest.icons.color, manifest.icons.outline];

const languages = (manifest.localizationInfo.additionalLanguages || []).map((lang) => lang.file);

const additionalFiles = [...icons, ...languages];

// Create Temp Directory
const tempName = fs.mkdtempSync("temp-");
const tempPath = path.join(root, tempName);
console.log(tempPath);

// Copy files to temp zip directory
const fromPath = manifestPath;
const toPath = path.join(tempPath, "manifest.json");
fs.copyFileSync(fromPath, toPath);

additionalFiles.forEach((filePath) => {
    const fromPath = path.join(root, filePath);
    const toPath = path.join(tempPath, filePath);
    fs.mkdirSync(path.dirname(toPath), { recursive: true });
    fs.copyFileSync(fromPath, toPath);
});

// Create Zip File
const zipPathIn = tempPath;
const zipFileName = outputFileName || "appPackage.zip";
const zipPathOut = path.normalize(path.join(outputDirectory, zipFileName));
if (fs.existsSync(zipPathOut)) {
    fs.rmSync(zipPathOut);
}

const files = fs.readdirSync(zipPathIn);
const tarCommand = isMac ? "tar" : "tar.exe";
const command = `${tarCommand} --auto-compress --create --verbose --file ${zipPathOut} ${files.join(" ")}`;
console.log(command);
execSync(command, { cwd: zipPathIn });

// Cleanup
fs.rmSync(tempPath, { recursive: true, force: true });

console.log(`\nCreated ${zipFileName}`);
