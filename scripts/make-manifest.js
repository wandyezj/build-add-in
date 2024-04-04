// Create manifests from base files
// Word, Excel, PowerPoint: template -> local -> production
// Outlook: local -> production

/**
 * clean data
 * @param {string} data
 * @returns
 */
function clean(data) {
    // remove the BOM
    // https://en.wikipedia.org/wiki/Byte_order_mark
    // The BOM is generally unexpected in text files and causes JSON.parse to fail.
    // U+FEFF is the Byte Order Mark for UTF-8
    data = data.replace(/^\uFEFF/, "");

    // standardize newlines to proper unix line endings
    data = data.replace(/\r/gm, "");
    return data;
}

/**
 * make manifest for localhost from template
 * @param {string} data
 */
function localhost(data) {
    const delimiterStart = "<!-- Word - Start -->";
    const delimiterEnd = "<!-- Word - End -->";
    const duplicate = data.split(delimiterStart)[1].split(delimiterEnd)[0].trimEnd();
    data = data.replaceAll(delimiterStart, "");
    data = data.replaceAll(delimiterEnd, "");

    // Place place template duplicates on Excel and PowerPoint
    data = data.replaceAll(
        "<!-- Duplicate:(Word) Replace:(Document,Workbook) -->",
        duplicate.replaceAll("Document", "Workbook")
    );
    data = data.replaceAll(
        "<!-- Duplicate:(Word) Replace:(Document,Presentation) -->",
        duplicate.replaceAll("Document", "Presentation")
    );

    return clean(data);
}

/**
 * make manifest for production from localhost
 * @param {string} manifest
 */
function production(data) {
    // replace
    data = data.replaceAll("https://localhost:3000/", "https://wandyezj.github.io/website-react-extension/");
    data = data.replaceAll("https://localhost:3000", "https://wandyezj.github.io");

    // for production remove local prefix
    data = data.replaceAll("(local) Build", "Build");

    data = data.replaceAll(
        "<Id>01000000-0000-0000-0000-000000007357</Id>",
        "<Id>01000000-0000-0000-1000-000000007357</Id>"
    );

    data = data.replaceAll("<Version>1.0.1.0</Version>", "<Version>1.0.0.0</Version>");

    return clean(data);
}

const templateManifestPath = "./manifests/template.xml";
const localManifestPath = "./manifests/local.xml";
const productionManifestPath = "./manifests/production.xml";

const outlookLocalManifestPath = "./manifests/local.outlook.xml";
const outlookProductionManifestPath = "./manifests/production.outlook.xml";

function main() {
    const fs = require("fs");

    const data = fs.readFileSync(templateManifestPath, { encoding: "utf-8" });

    const localhostData = localhost(data);
    fs.writeFileSync(localManifestPath, localhostData);

    const productionData = production(localhostData);
    fs.writeFileSync(productionManifestPath, productionData);

    // Outlook
    const outlookLocalhostData = fs.readFileSync(outlookLocalManifestPath, { encoding: "utf-8" });
    const outlookProductionData = production(outlookLocalhostData);
    fs.writeFileSync(outlookProductionManifestPath, outlookProductionData);
}

main();
