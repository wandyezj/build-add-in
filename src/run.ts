import { loadCurrentSnipToRun, loadStartupSnipToRun } from "./core/storage";
import { parseLibraries } from "./core/parseLibraries";
import { compileCode } from "./core/compileCode";
import { Snip } from "./core/Snip";
import { enableRunInlineConsole } from "./core/settings/enableRunInlineConsole";

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
    const isShared = window.location.hash === "#shared";

    const query = window.location.search;
    const search = new URLSearchParams(query);
    const open = search.get("open");

    /**
     * The snip to run.
     */
    let snip: Snip | undefined = undefined;

    if (isShared) {
        snip = await loadStartupSnipToRun();
    } else if (open) {
        // To prevent running of arbitrary code, prompt for consent.
        try {
            const module = await import("./core/getImportSnip");
            const snipText = await module.getImportSnip(open);
            if (snipText === undefined) {
                console.error("Failed to load snip from gist");
                return;
            }
            snip = JSON.parse(snipText);

            // verify the signature
            let author = undefined;
            if (snip) {
                const module = await import("./core/getSnipAuthor");
                const result = await module.getSnipAuthor(snip);
                author = result.result === module.SnipAuthorResultCode.Verified ? result.author : undefined;
            }

            // ask for consent to run the snip
            const message = `${author === undefined ? "Warning! " : ""}This snip is by ${author === undefined ? "an unknown author" : author.username + " on GitHub"}. Do you want to run it?`;
            console.log(message);
            const allow = window.confirm(message);
            if (!allow) {
                snip = undefined;
            }
        } catch (error) {
            console.error("Failed to load gist:", error);
            return;
        }
    } else {
        snip = await getCurrentSnip();
    }

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
        // window.location.href='./edit.html';
        const backButtonHtml = `<button onclick="window.history.back();"> Back</button>`;
        const refreshButtonHtml = `<button onclick="window.location.reload();">Refresh</button>`;
        html = `${backButtonHtml} ${refreshButtonHtml}<br/><br/>${html}`;
    }

    if (isShared) {
        const backButtonHtml = `<button onclick="window.location.href='./shared.html#reset'">Reset</button>`;
        html = `${backButtonHtml}<br/><br/>${html}`;
    }

    // compile TypeScript
    const ts = snip.files["typescript"].content;
    const results = compileCode(ts);
    const { issues } = results;
    let { js } = results;
    console.log("Issues");
    console.log(issues);

    const displayConsole = enableRunInlineConsole();
    if (displayConsole) {
        html = html + `\n<br/><div id="console"></div>`;
        js = `
const _____originalConsoleLog = console.log;
console.log = function () {
    _____originalConsoleLog.apply(console, arguments);
    const consoleDiv = document.getElementById("console");
    const newLine = document.createElement("div");
    newLine.textContent = Array.from(arguments).join(" ");
    consoleDiv.appendChild(newLine);
};
${js}`;
    }

    // Loading order matters
    await loadLibraries(libraries);
    loadCss(css);
    loadHtml(html);
    loadJs(js);
}

// TODO: does run need to prevent modifications to core functions. with Object.freeze?

runSnip();
