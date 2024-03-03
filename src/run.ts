import { loadSnip } from "./core/storage";
console.log("run");

function initialize() {
    const snip = loadSnip();
    console.log("snip", snip);
    if (snip === undefined) {
        return;
    }

    // Content
    const css = snip.files["css"].content;
    const html = snip.files["html"].content;
    // TODO: will need to compile TypeScript, where should this be done?
    const js = snip.files["typescript"].content;

    // insert css
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);

    // insert html
    document.body.innerHTML = html;

    // insert js
    const script = document.createElement("script");
    script.innerHTML = js;
    document.head.appendChild(script);
}

initialize();
