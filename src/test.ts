import { compress, decompress } from "./core/hexText";

function getButton(id: string) {
    return document.getElementById(id) as HTMLButtonElement;
}

function getTextArea(id: string) {
    return document.getElementById(id) as HTMLTextAreaElement;
}

function setup() {
    const buttonCompress = getButton("button-compress");
    const buttonDecompress = getButton("button-decompress");

    const textareaText = getTextArea("textarea-text");
    const textareaCompressed = getTextArea("textarea-compressed");

    const textareaDecompressed = getTextArea("textarea-decompressed");

    buttonCompress.onclick = async () => {
        const text = textareaText.value;
        const compressed = await compress(text);
        textareaCompressed.value = compressed;
    };

    buttonDecompress.onclick = async () => {
        const compressed = textareaCompressed.value;
        const decompressed = await decompress(compressed);
        textareaDecompressed.value = decompressed;
    };
}

setup();
