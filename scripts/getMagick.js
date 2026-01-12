//
// Get path to ImageMagick executable
// https://imagemagick.org/
//
// https://github.com/Homebrew/brew/releases
//

const path = require("path");
const os = require("os");
const fs = require("fs");

/**
 * Get path to imagemagick executable.
 * https://imagemagick.org/
 *
 * @throws {Error} if ImageMagick is not found.
 */
function getMagick() {
    const isMac = "Darwin" === os.type();
    const isWindows = "Windows_NT" === os.type();

    // Environment variables
    const tools = process.env.tools;
    const programFiles = process.env["ProgramFiles"];

    /**
     * @type {[boolean, string][]}
     */
    const options = [
        // On macOS, magick is installed via Homebrew
        [isMac, "/opt/homebrew/bin/magick"],

        // On Windows, magick is expected to be in Program Files
        [isWindows && programFiles, path.join(programFiles || "", "ImageMagick", "magick.exe")],

        // On Windows, magick could also be in the tools directory pointed to by the `tools` environment variable
        [isWindows && tools, path.join(tools || "", "ImageMagick", "magick.exe")],
    ];

    // Use the correct magick path based on the OS and what's available
    const magick = options
        .filter(([condition, path]) => condition && fs.existsSync(path))
        .map(([, path]) => (isWindows ? `"${path}"` : path))
        .reverse()
        .pop();

    if (!magick) {
        throw new Error("ImageMagick not found.");
    }

    return magick;
}

module.exports = { getMagick };
