import { log, LogTag } from "../log";

/**
 * Allow the user to upload a file.
 * @param accept - the type of file to accept
 * @returns The content of the file
 */
export function uploadFile(accept: ".json" | ".sig"): Promise<string> {
    return new Promise((resolve) => {
        log(LogTag.UploadFile, `accept=${accept}`);

        const element = document.createElement("input");
        element.setAttribute("type", "file");
        element.setAttribute("accept", accept);
        element.onchange = async (ev) => {
            const target = ev.target as HTMLInputElement;

            const files = target.files || [];

            if (files.length !== 1) {
                console.error(`can only load a single file`);
                return;
            }

            const file = files[0];
            const name = file.name;
            log(LogTag.UploadFile, `uploaded ${name}`);

            const text = await file.text();
            log(LogTag.UploadFile, text);

            resolve(text);
        };

        element.click();
    });
}
