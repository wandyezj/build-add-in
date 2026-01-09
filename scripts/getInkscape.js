//
// Get path to Inkscape 1.4.2 executable
// https://inkscape.org/
//

const path = require("path");
const os = require("os");
const fs = require("fs");

/**
 * Get path to Inkscape executable.
 * https://inkscape.org/
 *
 * @throws {Error} if Inkscape is not found.
 */
function getInkscape() {
    const isMac = "Darwin" === os.type();
    const isWindows = "Windows_NT" === os.type();

    // Environment variables
    const tools = process.env.tools;
    const programFiles = process.env["ProgramFiles"];

    /**
     * @type {[boolean, string][]}
     */
    const options = [
        // On macOS, Inkscape is expected to be in the installed Applications directory
        [isMac, "/Applications/Inkscape.app/Contents/MacOS/inkscape"],

        // On Windows, Inkscape is expected to be in Program Files
        [isWindows && programFiles, path.join(programFiles || "", "Inkscape", "bin", "inkscape.exe")],

        // On Windows, Inkscape could also be in the tools directory pointed to by the `tools` environment variable
        [isWindows && tools, path.join(tools || "", "Programs", "inkscape", "inkscape.exe")],
    ];

    // Use the correct Inkscape path based on the OS and what's available
    const inkscape = options
        .filter(([condition, path]) => condition && fs.existsSync(path))
        .map(([, path]) => (isWindows ? `"${path}"` : path))
        .reverse()
        .pop();

    if (!inkscape) {
        throw new Error("Inkscape not found.");
    }

    return inkscape;
}

module.exports = { getInkscape };
