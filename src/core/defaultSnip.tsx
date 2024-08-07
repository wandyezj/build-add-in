import { ExportSnip } from "./Snip";

export const defaultSnip: ExportSnip = {
    name: "New Snip",
    files: {
        typescript: {
            language: "typescript",
            content: `
//
// Click "Run" to execute the code below.
//

function ready() {
    console.log('Hello world!');

    // runExcel();
    // runWord();
    // runPowerPoint();
}

async function runExcel() {
    await Excel.run({ delayForCellEdit: true }, async (context) => {
        const range = context.workbook.getSelectedRange();
        range.format.fill.color = "yellow";
        range.load("value");
        await context.sync();
        console.log(\`The range address was "\${range.value}".\`);
    });
}

async function runWord() {
    await Word.run(async (context) => {
        const range: Word.Range = context.document.getSelection();
        range.font.color = "yellow";
        range.load("text");
        await context.sync();
        console.log(\`The selected text was "\${range.text}".\`);
    });
}

async function runPowerPoint() {
    await PowerPoint.run(async (context) => {
        const range = context.presentation.getSelection();
        range.font.color = "yellow";
        range.load("text");
        await context.sync();
        console.log(\`The selected text was "\${range.text}".\`);
    });
}


Office.onReady(({host, platform})=> {
    console.log("READY");

    const elementHost = document.getElementById('host');
    elementHost.innerText = \`\${host}\`;
    elementHost.style.color = getHostColor(host);

    const elementPlatform = document.getElementById('platform');
    elementPlatform.innerText = \`\${platform}\`;

    ready();
});

/**
 * Get a color associated with the host.
 */
function getHostColor(host: Office.HostType): string {
    const hostToColor = new Map<Office.HostType, string>([
        [Office.HostType.Excel, "green"],
        [Office.HostType.Word, "blue"],
        [Office.HostType.PowerPoint, "orange"],
        [Office.HostType.Outlook, "deepskyblue"],
    ]);
    const color = hostToColor.get(host) || "purple";
    return color;
}

`,
        },
        html: {
            language: "html",
            content: `
<h1 onclick="ready">Hello 
<span id="host">?</span>
on <span id="platform">?</span>
!</h1>
`,
        },
        css: {
            language: "css",
            content: `
body {
    background-color: white;
}

h1 { 
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
