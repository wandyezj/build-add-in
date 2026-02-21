//
// Script to create listing images for the store.
// It reads in a md file, extracts the images and alt text, and generates a new image with the image and alt text embedded in it.
// For different stores the alt text will need to be localized.
//

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { getMagick } = require("./getMagick");

const magick = getMagick();

const rootDirectory = path.resolve(__dirname, "..");
const listingDirectory = path.join(rootDirectory, "listing");

// In
const listingFilePath = path.join(listingDirectory, "listing-images.md");

// Out
const outputDirectory = path.join(listingDirectory, "images");

// specific width and height needed for the store
const width = 1366;
const height = 768;

// Read in the listing file

// Extract images and alt text from listing file

const listingFileContent = fs.readFileSync(listingFilePath, "utf8");

const imageRegex = /!\[(?<altText>.*?)\]\((?<imagePath>.*?)\)/g;
const matches = listingFileContent.matchAll(imageRegex);

const images = [];
for (const match of matches) {
    const altText = match.groups.altText;
    const imagePath = match.groups.imagePath;
    console.log(`
Image:
${imagePath}
${altText}
`);
    images.push({ altText, imagePath });
}

// Ensure output directory exists
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
}

// Create each listing image with alt text

//// cSpell:words pointsize findstr ghostwhite Segoe

function makeListingImage(imagePath, altText) {
    const inputImagePath = path.join(listingDirectory, imagePath);

    const outputImageName = `listing-${path.basename(imagePath, path.extname(imagePath))}-${width}-${height}.png`;
    const outputImagePath = path.join(outputDirectory, outputImageName);

    // Create the command to add alt text to the image
    // -gravity <Direction>:  Positions the text at the specified direction.
    //    Gravity options include:
    //          - Center - the center of the image.
    //          - South - the bottom of the image.
    //          - North - Positions the text at the top of the image.
    // -pointsize <size>: Sets the font to <size>.
    // -fill <color>: Sets the text color to <color>.
    // -font <font>: Sets the font to <font>.
    //      check the list of fonts with:magick convert -list font | findstr Font
    // -annotate +<horizontal>+<vertical> '<text>': Adds the <text> with an offset of <horizontal> <vertical>.
    // -background <color>: Sets the background color to <color>.
    // -splice 0x50: Adds a 50px height space at the bottom of the image.
    //
    const command = `${magick} "${inputImagePath}" -gravity South -background ghostwhite -splice 0x50 -font "Segoe-UI" -fill black -pointsize 24 -annotate +0+10 "${altText}" -strip -define png:exclude-chunks=date,time "${outputImagePath}"`;

    console.log(command);
    execSync(command, { stdio: "inherit" });
}

images.forEach(({ altText, imagePath }) => {
    makeListingImage(imagePath, altText);
});
