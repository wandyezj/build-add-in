let globalConsoleOverridden = false;

/**
 * Add a visible console to the end of the document body.
 * This displays any messages to console.log.
 *
 * @beta
 */
export function showConsole() {
    const hasConsole = document.getElementById("console");
    if (hasConsole) {
        document.body.removeChild(hasConsole);
    }

    const consoleDiv = document.createElement("div");
    consoleDiv.id = "console";
    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(consoleDiv);

    if (globalConsoleOverridden || hasConsole) {
        // Already overridden
        return;
    }

    const originalConsoleLog = console.log;
    console.log = function (...args: Parameters<typeof console.log>) {
        originalConsoleLog.apply(console, args);
        const consoleDiv = document.getElementById("console");

        if (consoleDiv === null) {
            return;
        }

        const newLine = document.createElement("div");
        newLine.textContent = args.map(String).join(" ");
        consoleDiv.appendChild(newLine);
    };
    globalConsoleOverridden = true;
}
