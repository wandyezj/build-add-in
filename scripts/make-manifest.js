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

function getSectionDelimiters(section) {
    const delimiterStart = `<!-- Section:(${section}) - Start -->`;
    const delimiterEnd = `<!-- Section:(${section}) - End -->`;
    return { delimiterStart, delimiterEnd };
}

/**
 * @param {string} section
 * @param {string} data
 * @returns {string}
 */
function getSectionContents(section, data) {
    const { delimiterStart, delimiterEnd } = getSectionDelimiters(section);
    const contents = data.split(delimiterStart)[1].split(delimiterEnd)[0].trimEnd();
    return contents;
}

/**
 * Replace data section
 * @param {string} section
 * @param {string} data
 * @param {string} replace
 * @returns {string}
 */
function replaceSection(section, data, replace) {
    const { delimiterStart, delimiterEnd } = getSectionDelimiters(section);
    const sectionDataBefore = data.split(delimiterStart)[0].trimEnd();
    const sectionDataAfter = data.split(delimiterEnd)[1].trimStart();
    return `${sectionDataBefore}
${replace}
${sectionDataAfter}`;
}

/**
 * Replace data section with empty string
 * @param {string} section
 * @param {string} data
 * @returns {string}
 */
function removeSection(section, data) {
    return replaceSection(section, data, "");
}

function removeSectionDelimiters(section, data) {
    const { delimiterStart, delimiterEnd } = getSectionDelimiters(section);
    data = data.replaceAll(delimiterStart, "");
    data = data.replaceAll(delimiterEnd, "");
    return data;
}

/**
 * make manifest for localhost from template
 * @param {string} data
 * @returns {string}
 */
function localhost(data) {
    const sectionHost = "Host";

    const duplicate = getSectionContents(sectionHost, data);
    data = removeSection("Host", data);

    // Remove these from the Word and PowerPoint hosts
    const sectionRuntime = "Runtimes only Excel";
    const sectionActionsGroup = "Actions only Excel";

    // Create Host for Word, Excel and PowerPoint

    // Word
    let hostWord = duplicate.replaceAll("Document", "Document");
    hostWord = removeSection(sectionRuntime, hostWord);
    hostWord = removeSection(sectionActionsGroup, hostWord);
    data = data.replaceAll("<!-- Duplicate:(Host) Replace:(Document,Document) -->", hostWord);

    // Excel
    let hostExcel = duplicate.replaceAll("Document", "Workbook");
    hostExcel = removeSectionDelimiters(sectionRuntime, hostExcel);
    hostExcel = removeSectionDelimiters(sectionActionsGroup, hostExcel);
    data = data.replaceAll("<!-- Duplicate:(Host) Replace:(Document,Workbook) -->", hostExcel);

    // PowerPoint
    let hostPowerPoint = duplicate.replaceAll("Document", "Presentation");
    hostPowerPoint = removeSection(sectionRuntime, hostPowerPoint);
    hostPowerPoint = removeSection(sectionActionsGroup, hostPowerPoint);
    data = data.replaceAll("<!-- Duplicate:(Host) Replace:(Document,Presentation) -->", hostPowerPoint);

    return clean(data);
}

function localhostOutlook(data) {
    const sectionExtensionPoint = "ExtensionPoint";
    const duplicate = getSectionContents(sectionExtensionPoint, data);
    data = removeSection(sectionExtensionPoint, data);

    // Create new section and update ids
    function createSection(extensionPointName, prefixId) {
        let extensionPointSection = duplicate.replace("MessageComposeCommandSurface", extensionPointName);
        // Replace Ids with unique equivalent

        const findId = / id="(?<value>.*Id)"/;
        const findIdsGlobal = / id="(?<value>.*Id)"/g;
        let matches = extensionPointSection.match(findIdsGlobal);

        matches.forEach((value) => {
            //console.log(value);
            const id = value.match(findId).groups["value"];
            //console.log(id);
            extensionPointSection = extensionPointSection.replace(id, `${prefixId}.${id}`);
        });

        return extensionPointSection;
    }

    // Compose
    const extensionPointCompose = createSection("MessageComposeCommandSurface", "Compose");
    data = data.replaceAll(
        "<!-- Duplicate:(ExtensionPoint) Replace:(MessageComposeCommandSurface,MessageComposeCommandSurface) -->",
        extensionPointCompose
    );

    // Read
    const extensionPointRead = createSection("MessageReadCommandSurface", "Read");
    data = data.replaceAll(
        "<!-- Duplicate:(ExtensionPoint) Replace:(MessageComposeCommandSurface,MessageReadCommandSurface) -->",
        extensionPointRead
    );

    return data;
}

/**
 * make manifest for production from localhost
 * @param {string} manifest
 */
function production(data) {
    // replace
    data = data.replaceAll("https://localhost:3000/", "https://wandyezj.github.io/build-add-in/");
    data = data.replaceAll("https://localhost:3000", "https://wandyezj.github.io");

    // for production remove local prefix
    data = data.replaceAll("(local) Build", "Build");
    data = data.replaceAll("(local) Extension", "Extension");

    data = data.replaceAll(
        "<Id>01000000-0000-0000-0000-000000007357</Id>",
        "<Id>01000000-0000-0000-1000-000000007357</Id>"
    );

    data = data.replaceAll("<Version>1.0.1.0</Version>", "<Version>1.0.0.0</Version>");
    data = data.replaceAll("<Version>2.0.1.0</Version>", "<Version>2.0.0.0</Version>");

    return clean(data);
}

const templateManifestPath = "./manifests/template.xml";
const localManifestPath = "./manifests/local.xml";
const productionManifestPath = "./manifests/production.xml";

const outlookTemplateManifestPath = "./manifests/template.outlook.xml";
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

    const outlookData = fs.readFileSync(outlookTemplateManifestPath, { encoding: "utf-8" });
    const outlookLocalhostData = localhostOutlook(outlookData);
    fs.writeFileSync(outlookLocalManifestPath, outlookLocalhostData);

    const outlookProductionData = production(outlookLocalhostData);
    fs.writeFileSync(outlookProductionManifestPath, outlookProductionData);
}

main();
