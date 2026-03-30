let _____globalConsoleOverridden = false;

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

    if (_____globalConsoleOverridden || hasConsole) {
        // Already overridden
        return;
    }

    const _____originalConsoleLog = console.log;
    console.log = function () {
        _____originalConsoleLog.apply(console, arguments as any);
        const consoleDiv = document.getElementById("console");

        if (consoleDiv === null) {
            return;
        }

        const newLine = document.createElement("div");
        newLine.textContent = Array.from(arguments).join(" ");
        consoleDiv.appendChild(newLine);
    };
    _____globalConsoleOverridden = true;
}
