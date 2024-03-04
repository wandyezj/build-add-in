import { loadSnip } from "./core/storage";
console.log("run");

type LibType = "css" | "js" | undefined;

async function loadScript(lib: string) {
    return new Promise<void>((resolve) => {
        console.log("load js - start: ", lib);
        const script = document.createElement("script");
        script.setAttribute("src", lib);
        script.onload = () => {
            console.log("load js - complete: ", lib);
            resolve();
        };
        // TODO: reject if it takes too long
        document.head.appendChild(script);
    });
}

async function loadLibraries(libraries: string) {
    // trim and remove empty lines
    const libs = libraries
        .split("\n")
        .map((lib) => lib.trim())
        .filter((lib) => lib !== "")
        .map((lib) => {
            let libType: LibType = undefined;
            const isLink = lib.startsWith("http://") || lib.startsWith("https://");
            if (isLink) {
                if (lib.endsWith(".css")) {
                    libType = "css";
                } else if (lib.endsWith(".js")) {
                    libType = "js";
                }
            }

            return {
                lib,
                libType,
            };
        });

    const js = libs.filter(({ libType }) => libType === "js").map(({ lib }) => lib);
    const css = libs.filter(({ libType }) => libType === "css").map(({ lib }) => lib);

    // load js first
    await Promise.all(js.map(loadScript));

    // load css
    css.forEach((lib) => {
        console.log(`load css  - start ${lib}`);
        const style = document.createElement("link");
        style.rel = "stylesheet";
        style.href = lib;
        style.onload = () => {
            console.log(`load css - complete: ${lib}`);
        };
        document.head.appendChild(style);
    });
}

function loadCss(css: string) {
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
}

function loadHtml(html: string) {
    document.body.innerHTML = html;
}

function loadJs(js: string) {
    const script = document.createElement("script");
    script.innerHTML = js;
    document.head.appendChild(script);
}

async function initialize() {
    const snip = loadSnip();
    console.log("snip", snip);
    if (snip === undefined) {
        return;
    }

    // Content
    const libraries = snip.files["libraries"].content;
    const css = snip.files["css"].content;
    const html = snip.files["html"].content;
    // TODO: will need to compile TypeScript, where should this be done?
    const js = snip.files["typescript"].content;

    // Loading order matters
    await loadLibraries(libraries);
    loadCss(css);
    loadHtml(html);
    loadJs(js);
}

// Prevent modifications to core functions.
[initialize, loadScript, loadLibraries, loadCss, loadHtml, loadJs].forEach((fn) => {
    Object.freeze(fn);
});

initialize();
