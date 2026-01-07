//
// Produce cropped images for the store listing
// Use ImageMagick to crop the images.
// https://github.com/Homebrew/brew/releases
//

const { execSync } = require("child_process");
const path = require("path");
const os = require("os");

const listingDirectory = __dirname;

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

// specific width and height needed for the store
const width = 1366;
const height = 768;

function crop(name) {
    console.log();
    console.log(`Crop ${name}`);

    const imageName = `${name}-taskpane-${width}-${height}.png`;

    const imageIn = path.join(listingDirectory, imageName);
    const imageOut = imageIn;

    const command = `${magick} "${imageIn}" -crop ${width}x${height}+0+0 "${imageOut}"`;

    console.log(command);
    execSync(command, { stdio: "inherit" });
}

// crop and save over the original images

const shots = ["outlook", "excel", "powerpoint", "word"];

shots.forEach((name) => {
    crop(name);
});
