import { Snip } from "./Snip";

export const defaultSnip: Omit<Snip, "id"> = {
    name: "Default Snip",
    files: {
        typescript: {
            language: "typescript",
            content: `function x() {
    console.log('Hello world!');
}

Office.onReady(({host, platform})=> {
    console.log("READY");
    document.getElementById('host').innerText = \`Host: \${host}\`;
    document.getElementById('platform').innerText = \`Platform: \${platform}\`;
})`,
        },
        html: {
            language: "html",
            content: `
<h1>Hello world!</h1>
<h2 id="host"></h2>
<h2 id="platform"></h2>
        `,
        },
        css: {
            language: "css",
            content: `h1 { 
                color: red;
}`,
        },
        libraries: {
            language: "text",
            content:
                "https://appsforoffice.microsoft.com/lib/1/hosted/office.js\nhttps://appsforoffice.microsoft.com/lib/1/hosted/office.d.ts",
        },
    },
};
