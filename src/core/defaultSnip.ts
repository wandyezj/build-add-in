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

function run() {
    console.log("run");

    // runExcel();
    // runWord();
    // runPowerPoint();
    // runOutlook();
}

function ready() {
    console.log('Hello world!');
    document.getElementById("button-run").hidden = false;
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

async function runOutlook() {
    Office.context.mailbox.item.getSelectedDataAsync(Office.CoercionType.Text, function(asyncResult) {
        if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
            const text = asyncResult.value.data;
            const prop = asyncResult.value.sourceProperty;
            console.log(\`The selected text in "\${prop}" was "\${text}".\`);
        } else {
            console.error(asyncResult.error);
        }
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
<button id="button-run" onclick="run()" hidden>Run</button>
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
}

#button-run {
    margin: 0;
    margin-left: 20px;
    margin-bottom: 5px;
    min-width: 80px;
    background-color: #f4f4f4;
    border: 1px solid #f4f4f4;
    padding: 4px 20px 6px;
}

#button-run:hover {
    background-color: #eaeaea;
}

#button-run:focus {
    background-color: #eaeaea;
    border-color: #0078d7;
}

#button-run:active {
    background-color: #0078d7;
    border-color: #0078d7;
    color: #fff;
}


`,
        },
        libraries: {
            language: "text",
            content:
                "https://appsforoffice.microsoft.com/lib/1/hosted/office.js\nhttps://appsforoffice.microsoft.com/lib/1/hosted/office.d.ts",
        },
    },
};
