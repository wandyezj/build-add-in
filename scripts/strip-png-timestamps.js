//
// Strips all timestamps from PNG images in a directory using ImageMagick.
//

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const { getMagick } = require("./getMagic.js");

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
