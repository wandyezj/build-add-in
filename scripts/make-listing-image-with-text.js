//
// Center an image and fill the background
//

// magick input.jpg -gravity center -background white -extent 1000x1000 output.jpg

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { getMagick } = require("./getMagick");

const magick = getMagick();

const rootDirectory = path.resolve(__dirname, "..");
const listingDirectory = path.join(rootDirectory, "listing");

// Out
const outputDirectory = path.join(listingDirectory, "images");

// specific width and height needed for the store
const width = 1366;
const height = 768;

const parameters = process.argv.slice(2);

if (parameters.length !== 3) {
    console.log("usage: [image file name in] [text] [image file name out]");
    process.exit(1);
}

const [imageFileNameIn, text, imageFileNameOut] = parameters;

const imageFilePathIn = path.join(listingDirectory, "images-partial", imageFileNameIn);
const imageFilePathOut = path.join(outputDirectory, `listing-${imageFileNameOut.split(".")[0]}-${width}-${height}.png`);

if (!fs.existsSync(imageFilePathIn)) {
    console.error(`Image file not found: ${imageFilePathIn}`);
    process.exit(1);
}

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
}

// Center the image and fill the background
execSync(
    `${magick} "${imageFilePathIn}" -gravity center -background white -extent ${width}x${height} "${imageFilePathOut}"`,
    { stdio: "inherit" }
);

// cSpell:words pointsize
const altText = text; // Use the provided text
const textOption = `-gravity south -font "Monaco" -fill black -pointsize 50 -annotate +0+30 "${altText}" -strip -define png:exclude-chunks=date,time `;

execSync(`${magick} "${imageFilePathOut}" ${textOption} "${imageFilePathOut}"`, { stdio: "inherit" });

console.log(`Image processed and saved to: ${imageFilePathOut}`);
