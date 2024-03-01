// Delete a directory
// node clean.js directory

const fs = require("fs");

const parameters = process.argv.slice(2);

if (parameters.length !== 1) {
    console.log("usage: [delete directory path]");
    process.exit(1);
}

const [target] = parameters;

if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true });
}
