import { Snip } from "./Snip";

export const defaultSnip: Omit<Snip, "id"> = {
    name: "Default Snip",
    files: {
        typescript: {
            language: "typescript",
            content: `
//
// Click "Run" to execute the code below.
//

function ready() {
    console.log('Hello world!');
}

Office.onReady(({host, platform})=> {
    console.log("READY");

    const elementHost = document.getElementById('host');
    elementHost.innerText = host.toString();
    elementHost.style.color = getHostColor(host);

    document.getElementById('platform').innerText = platform.toString();
});

/**
 * Get a color associated with the host.
 */
function getHostColor(host: Office.HostType): string {
    const hostToColor = new Map<Office.HostType, string>([
        [Office.HostType.Excel, "green"],
        [Office.HostType.Word, "blue"],
        [Office.HostType.PowerPoint, "orange"],
    ]);
    const color = hostToColor.get(host) || "purple";
    return color;
}
`,
        },
        html: {
            language: "html",
            content: `
<h1 onclick="ready">Hello <span id="host">?</span> on <span id="platform">?</span>!</h1>
`,
        },
        css: {
            language: "css",
            content: `h1 { 
    color: black;
}`,
        },
        libraries: {
            language: "text",
            content:
                "https://appsforoffice.microsoft.com/lib/1/hosted/office.js\nhttps://appsforoffice.microsoft.com/lib/1/hosted/office.d.ts",
        },
    },
};
