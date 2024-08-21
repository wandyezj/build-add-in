import { loadCurrentSnipToRun } from "./core/storage";
import { parseLibraries } from "./core/parseLibraries";
import { compileCode } from "./core/compileCode";

console.log("run");

async function getCurrentSnip() {
    // Cannot simply use id.
    // Embed requires office.js to be loaded.
    // Office.js must be loaded _after_ the snip.
    // Work around with local storage for the embed case.
    const snip = loadCurrentSnipToRun();
    if (snip === undefined) {
        return undefined;
    }

    return snip;
}

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
    const { js, css } = parseLibraries(libraries);

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

async function runSnip() {
    const goBack = window.location.hash === "#back";

    const snip = await getCurrentSnip();
    console.log("snip", snip);
    if (snip === undefined) {
        return;
    }

    // Content
    const libraries = snip.files["libraries"].content;
    const css = snip.files["css"].content;
    let html = snip.files["html"].content;
    // Add back button to top of html
    if (goBack) {
        const backButtonHtml = `<button onclick="window.location.href='./edit.html';"> Back</button>`;
        const refreshButtonHtml = `<button onclick="window.location.reload();">Refresh</button>`;
        html = `${backButtonHtml} ${refreshButtonHtml}<br/><br/>${html}`;
    }
    // TODO: will need to compile TypeScript, where should this be done?
    const ts = snip.files["typescript"].content;
    const { js, issues } = compileCode(ts);
    console.log("Issues");
    console.log(issues);

    // Loading order matters
    await loadLibraries(libraries);
    loadCss(css);
    loadHtml(html);
    loadJs(js);
}

// TODO: does run need to prevent modifications to core functions. with Object.freeze?

runSnip();
