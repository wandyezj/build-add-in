// Create the local manifest from the template  .
const fs = require("fs");
const path = require("path");
const { parse } = require("jsonc-parser");

const root = path.join(__dirname, "..");

// In
const templateManifestPath = path.join(root, "manifests", "template.manifest.jsonc");

// Out
const localManifestPath = path.join(root, "manifests", "local.manifest.json");

// Read the template manifest and strip comments.

const templateText = fs.readFileSync(templateManifestPath, "utf8");

/**
 * @type {{name: {short: string; full: string;}; description: {short: string; full: string;}; extensions: {runtimes:{}[]; ribbons: {contexts: string[]; tabs: {id: string;}[];}[];}[]; }}
 */
const template = parse(templateText, [], {
    allowTrailingComma: true,
    disallowComments: false,
    disallowCommentsBeforeTrailingComma: false,
});

/**
 * Clone an object.
 * @template T
 * @param {T} o
 * @returns {T}
 */
function clone(o) {
    return JSON.parse(JSON.stringify(o));
}

// Duplicate outlook mailRead for the other four areas
// mailRead, mailCompose, meetingDetailsOrganizer, meetingDetailsAttendee

const mailRead = template.extensions[0].ribbons.find(({ contexts }) => contexts[0] === "mailRead");

["mailCompose", "meetingDetailsOrganizer", "meetingDetailsAttendee"].forEach((contextName) => {
    const outlookTemplate = clone(mailRead);
    outlookTemplate.contexts = [contextName];
    template.extensions[0].ribbons.push(outlookTemplate);
});

const descriptionFull = `
Build Extensions in Word, Excel, PowerPoint, and Outlook
`.trim();

template.description.full = descriptionFull;

// Output the new local manifest
const localManifestText = JSON.stringify(template, null, 4);
fs.writeFileSync(localManifestPath, localManifestText, "utf8");
