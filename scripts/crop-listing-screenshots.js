//
// Produce cropped images for the store listing using ImageMagick.
//

const { execSync } = require("child_process");
const path = require("path");
const { getMagick } = require("./getMagick.js");

const magick = getMagick();

const rootDirectory = path.resolve(__dirname, "..");
const listingDirectory = path.join(rootDirectory, "listing");

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
