//
// Use Inkscape 1.4.2 to generate PNG asset icons from Fluent UI SVG files
//

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

const assetsDirectory = __dirname;
const fluentSvgDirectory = path.join(assetsDirectory, "fluent-svg");

const isMac = "Darwin" === os.type();

// On Windows, Inkscape is expected to be in the tools directory pointed to by the `tools` environment variable
const inkscapeWindows = `"${path.join(process.env.tools || "", "Programs", "inkscape", "inkscape.exe")}"`;

// On macOS, Inkscape is expected to be in the installed Applications directory
const inkscapeMac = "/Applications/Inkscape.app/Contents/MacOS/inkscape";

// Use the correct Inkscape path based on the OS
const inkscape = isMac ? inkscapeMac : inkscapeWindows;

/**
 * Generate a single PNG from an SVG using inkscape
 */
function generateIcon(svgName, pngName, pngSize) {
    let svgSize = pngSize >= 48 ? 48 : pngSize;

    let sourceSvg = path.join(fluentSvgDirectory, `ic_fluent_${svgName}_${svgSize}_regular.svg`);

    // Fallback to 32 if SVG does not exist
    if (!fs.existsSync(sourceSvg)) {
        svgSize = 32;
        sourceSvg = path.join(fluentSvgDirectory, `ic_fluent_${svgName}_${svgSize}_regular.svg`);
    }

    const destinationPng = path.join(assetsDirectory, `${pngName}-${pngSize}.png`);

    console.log(`${pngName} ${pngSize}`);

    const command = `${inkscape} "${sourceSvg}" --export-width=${pngSize} --export-height=${pngSize} --export-filename="${destinationPng}"`;

    console.log(command);
    execSync(command, { stdio: "inherit" });
    console.log();
}

//
// Main icon
//

const svgName = "hexagon";
const pngName = "icon";

[16, 32, 64, 80, 128, 192, 300].forEach((size) => {
    generateIcon(svgName, pngName, size);
});

//
// Generate fluent svg icons
//

/**
 * Make icons in standard sizes.
 * @param {string} svgName
 * @param {string} pngName
 */
function makeIcon(svgName, pngName) {
    const sizes = [16, 32, 80];
    sizes.forEach((size) => {
        generateIcon(svgName, pngName, size);
    });
}

// edit
// play
// settings
["edit", "play", "settings"].forEach((name) => {
    makeIcon(name, `icon-${name}`);
});

// help
makeIcon("question", "icon-help");

// actions
makeIcon("script", "icon-actions");
