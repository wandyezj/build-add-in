const fs = require("fs");
const path = require("path");

const manifestDirectory = "./manifests";
const shareDirectory = "C:/manifests";

const manifests = fs
    .readdirSync(manifestDirectory)
    .filter((file) => file.endsWith(".xml") && (file.startsWith("production") || file.startsWith("local")));

function getManifestPrefix(data) {
    const displayName = data.split(`<DisplayName DefaultValue="`)[1].split(`"`)[0];
    const prefix = displayName.replace("(local)", "").trim().split(" ").join("-").toLowerCase();
    return prefix;
}

manifests.forEach((file) => {
    const source = path.join(manifestDirectory, file);

    const data = fs.readFileSync(source, { encoding: "utf-8" });

    const uniquePrefix = getManifestPrefix(data);
    const name = `${uniquePrefix}.${file}`;
    const destination = path.join(shareDirectory, name);
    console.log(`${name}\n\t${source} -> ${destination}`);

    fs.writeFileSync(destination, data);
});
