//
// Strips all timestamps from PNG images in a directory using ImageMagick.
// https://github.com/Homebrew/brew/releases
//

const { execSync } = require("child_process");
const path = require("path");
const os = require("os");
const fs = require("fs");

function getMagick() {
    const isMac = "Darwin" === os.type();
    const isWindows = "Windows_NT" === os.type();

    // Validate tools env var
    const tools = process.env.tools;
    if (!tools && isWindows) {
        console.error("Must define tool path");
        process.exit(1);
    }

    // On Windows, Inkscape is expected to be in the tools directory pointed to by the `tools` environment variable
    const magickWindows = `"${path.join(tools || "", "Programs", "ImageMagick", "magick.exe")}"`;

    // On macOS, magick is installed via Homebrew
    const magickMac = "/opt/homebrew/bin/magick";

    // Use the correct Inkscape path based on the OS
    const magick = isMac ? magickMac : magickWindows;
    return magick;
}

const magick = getMagick();

function stripTimestamp(imagePath) {
    const command = `${magick} "${imagePath}" -strip -define png:exclude-chunks=date,time "${imagePath}"`;
    console.log(command);
    execSync(command, { stdio: "inherit" });
}

const parameters = process.argv.slice(2);

if (![1].includes(parameters.length)) {
    console.log("usage: [png directory]");
    process.exit(1);
}

const [pngDirectory] = parameters;

const pngPath = path.resolve(pngDirectory);

console.log(`\nStripping timestamps from PNGs in: ${pngDirectory}`);

const files = fs.readdirSync(pngPath).filter((file) => file.endsWith(".png"));

files.forEach((file) => {
    console.log(`\n${file}`);
    const filePath = path.join(pngPath, file);
    stripTimestamp(filePath);
});
