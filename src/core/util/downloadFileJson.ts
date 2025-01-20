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
function downloadFile({ filename, text, encoding }: { filename: string; text: string; encoding: string }) {
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
