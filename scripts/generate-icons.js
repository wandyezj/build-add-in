//
// Generate PNG asset icons from Fluent UI SVG files using Inkscape.
//

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const { getInkscape } = require("./getInkscape.js");

const inkscape = getInkscape();

const rootDirectory = path.resolve(__dirname, "..");
const assetsDirectory = path.join(rootDirectory, "assets");
const fluentSvgDirectory = path.join(assetsDirectory, "fluent-svg");

/**
 * Generate a single PNG from an SVG using inkscape
 * @param {string} sourceSvg
 * @param {string} pngName
 * @param {number} pngSize
 */
function generateIcon(sourceSvg, pngName, pngSize) {
    console.log(`${pngName} ${pngSize}`);

    const destinationPng = path.join(assetsDirectory, `${pngName}-${pngSize}.png`);

    const command = `${inkscape} "${sourceSvg}" --export-width=${pngSize} --export-height=${pngSize} --export-filename="${destinationPng}"`;

    console.log(command);
    execSync(command, { stdio: "inherit" });
    console.log();
}

/**
 * Generate a single PNG from an SVG using inkscape
 */
function makeIconFromFluentSvg(svgName, pngName, pngSize) {
    let svgSize = pngSize >= 48 ? 48 : pngSize;

    let sourceSvg = path.join(fluentSvgDirectory, `ic_fluent_${svgName}_${svgSize}_regular.svg`);

    // Fallback to 32 if SVG does not exist
    if (!fs.existsSync(sourceSvg)) {
        svgSize = 32;
        sourceSvg = path.join(fluentSvgDirectory, `ic_fluent_${svgName}_${svgSize}_regular.svg`);
    }

    generateIcon(sourceSvg, pngName, pngSize);
}

//
// Main icon
//

const svgName = "hexagon";
const pngName = "icon";

[16, 32, 64, 80, 128, 192, 300].forEach((size) => {
    makeIconFromFluentSvg(svgName, pngName, size);
});

// Outline version of main icon
generateIcon(path.join(assetsDirectory, "icon-outline-32.svg"), "icon-outline", 32);

//
// Generate fluent svg icons
//

/**
 * Make icons in standard sizes.
 * @param {string} svgName
 * @param {string} pngName
 */
function makeIcons(svgName, pngName) {
    const sizes = [16, 32, 80];
    sizes.forEach((size) => {
        makeIconFromFluentSvg(svgName, pngName, size);
    });
}

// edit
// play
// settings
["edit", "play", "settings"].forEach((name) => {
    makeIcons(name, `icon-${name}`);
});

// help
makeIcons("question", "icon-help");

// actions
makeIcons("script", "icon-actions");
