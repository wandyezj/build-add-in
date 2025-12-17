// Create the production manifest by modifying the local manifest.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

// In
const localManifestPath = path.join(root, "manifests", "local.manifest.json");

// Out
const productionManifestPath = path.join(root, "manifests", "production.manifest.json");

/**
 * Create a function that traverses and modifies nodes.
 * @param {(s: string) => string} modifyString
 * @return {(node: unknown) => unknown}
 */
function getTraverseAndModify(modifyString) {
    /**
     * Traverse and modify the manifest object.
     * @param {unknown} node
     */
    function traverseAndModify(node) {
        if (typeof node === "string") {
            return modifyString(node);
        }

        if (Array.isArray(node)) {
            for (let i = 0; i < node.length; i++) {
                node[i] = traverseAndModify(node[i]);
            }
            return node;
        }

        if (typeof node === "object") {
            for (const key in node) {
                node[key] = traverseAndModify(node[key]);
            }
            return node;
        }

        return node;
    }
    return traverseAndModify;
}

/**
 * @type {[string, string][]} - [prefix to replace, replacement]
 * @returns {(s: string) => string}
 */
function getModifyString(prefixes) {
    function modifyString(s) {
        for (const [prefix, replacement] of prefixes) {
            if (s.startsWith(prefix)) {
                return s.replace(prefix, replacement);
            }
        }
        return s;
    }
    return modifyString;
}

// Modify the local manifest to create the production manifest.

// What needs to change?
//
// Recursively modify:
// - name
// - URL paths
//
// Directly modify:
// - id
// - version

/**
 * Create a modified manifest from the local host manifest.
 * @param {string} localManifestPath
 * @param {string} newManifestPath
 * @param {string} id
 * @param {string} version
 * @param {[string,string][]} prefixes - [original, replacement][]
 */
function makeModifiedManifest(localManifestPath, newManifestPath, id, version, prefixes) {
    const localManifestText = fs.readFileSync(localManifestPath, "utf8");
    const localManifest = JSON.parse(localManifestText);

    const modifiedManifest = getTraverseAndModify(getModifyString(prefixes))(localManifest);

    modifiedManifest.id = id;
    modifiedManifest.version = version;

    // Write the production manifest to file.
    const modifiedManifestText = JSON.stringify(modifiedManifest, null, 4);
    fs.writeFileSync(newManifestPath, modifiedManifestText, "utf8");
}

makeModifiedManifest(localManifestPath, productionManifestPath, "01000000-0000-0000-0000-b1d00000970d", "1.0.0", [
    ["https://localhost:3000/", "https://wandyezj.github.io/build-add-in/"],
    ["localhost:3000", "wandyezj.github.io"],
    ["(local) (unity) Build", "Build"],
]);

console.log(`Complete`);
