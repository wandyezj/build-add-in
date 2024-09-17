import { log, LogTag } from "./log";

export async function copyTextToClipboard(text: string) {
    log(LogTag.CopyToClipboard, `copyTextToClipboard - Secure Context ${window.isSecureContext}`);
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        log(LogTag.CopyToClipboard, "Fallback to command copy");
        copyTextToClipboardWithCommand(text);
    }
}

/**
 * Fallback in case the clipboard API is not available.
 */
function copyTextToClipboardWithCommand(text: string) {
    log(LogTag.CopyToClipboard, "copyTextToClipboardWithCommand");
    const element = document.createElement("textarea");

    // Hide temp element
    //element.hidden = true;
    element.style.position = "absolute";
    element.style.left = "-1000px";
    element.style.top = "-1000px";

    element.value = text;
    document.body.appendChild(element);
    element.select();
    document.execCommand("copy");
    document.body.removeChild(element);
}
