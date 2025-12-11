// Create the production manifest by modifying the local manifest.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

const localManifestPath = path.join(root, "manifests", "local.manifest.json");
const productionManifestPath = path.join(root, "manifests", "production.manifest.json");

const localManifestText = fs.readFileSync(localManifestPath, "utf8");
const manifest = JSON.parse(localManifestText);

/**
 * Transform the string for production.
 * @param {string} s
 */
function modifyString(s) {
    const localhostPrefix = "https://localhost:3000";
    const productionPrefix = "https://wandyezj.github.io/build-add-in";
    if (s.startsWith(localhostPrefix)) {
        return s.replace(localhostPrefix, productionPrefix);
    }

    const localNamePrefix = "(local) (unity)";
    const productionNamePrefix = "(unity)";
    if (s.startsWith(localNamePrefix)) {
        return s.replace(localNamePrefix, productionNamePrefix);
    }

    return s;
}

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

const productionManifest = traverseAndModify(manifest);

productionManifest.id = "01000000-0000-0000-1000-b1d000007357";
productionManifest.version = "1.0.0";

// Write the production manifest to file.
const productionManifestText = JSON.stringify(productionManifest, null, 4);
fs.writeFileSync(productionManifestPath, productionManifestText, "utf8");

console.log(`Complete`);
