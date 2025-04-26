//
// Extract all loc strings from the source code
// loc strings look like this:
// loc("string")
//

// Gather a list of all source files
const fs = require("fs");

// recursively read all files in a directory
function readDir(dir) {
    const files = fs.readdirSync(dir);
    let allFiles = [];
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            allFiles = allFiles.concat(readDir(fullPath));
        } else {
            allFiles.push(fullPath);
        }
    }
    return allFiles;
}

const files = readDir("src");

// Filter out all files that are not .ts or tsx
const sourceFiles = files.filter((file) => {
    return file.endsWith(".ts") || file.endsWith(".tsx");
});

// Read all files and extract loc strings
const locStrings = [
    {
        file: "file",
        line: "line",
        string: "string",
    },
];
for (const file of sourceFiles) {
    const data = fs.readFileSync(file, "utf8");
    const regex = /loc\("(?<string>.*)"\)/g;
    // Find all matches
    const matches = [...data.matchAll(regex)];

    // Add the strings to the list
    const strings = matches.map((match) => {
        // Add the string to the list
        const locString = match.groups.string;
        return {
            file: file,
            line: data.substring(0, match.index).split("\n").length,
            string: locString,
        };
    });

    locStrings.push(...strings);
}

// Write the strings to a file
const locFile = "./localize/loc.tsv";
const locData = locStrings
    .map(({ file, string }) => {
        return [file, `"${string}"`].join("\t");
    })
    .join("\n");
fs.writeFileSync(locFile, locData, "utf8");

console.log(`Wrote ${locStrings.length} loc strings to ${locFile}`);
