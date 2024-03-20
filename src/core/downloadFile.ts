/**
 * download a file by inserting a link element with the url containing the encoding
 * @param filename
 * @param url
 */
function downloadFileUrl({ filename, url }: { filename: string; url: string }) {
    const element = document.createElement("a");

    element.setAttribute("href", url);
    element.setAttribute("download", filename);
    element.click();
}

/**
 * download file
 * @param filename - name of the file to download
 * @param text - contents of the text file utf-16 text
 * @param encoding - mime type of the file
 */
export function downloadFile({ filename, text, encoding }: { filename: string; text: string; encoding: string }) {
    const blob = new Blob([text], { type: encoding });
    const downloadUrl = URL.createObjectURL(blob);
    console.log(downloadUrl);
    //console.log(downloadUrl)
    downloadFileUrl({ filename, url: downloadUrl });
    URL.revokeObjectURL(downloadUrl);
}

export function downloadFileJson(text: string, filename: string) {
    const encoding = "data:text/plain";
    downloadFile({ filename, text, encoding });
}

export function uploadFileJson(): Promise<string> {
    return new Promise((resolve) => {
        console.log("uploadFileJson");
        const element = document.createElement("input");
        element.setAttribute("type", "file");
        element.setAttribute("accept", ".json");
        element.onchange = async (ev) => {
            const target = ev.target as HTMLInputElement;

            const files = target.files || [];

            if (files.length !== 1) {
                console.error(`can only load a single file`);
                return;
            }

            const file = files[0];
            const name = file.name;
            console.log(`uploaded ${name}`);
            const text = await file.text();
            //console.log(text);
            resolve(text);
        };

        element.click();
    });
}
