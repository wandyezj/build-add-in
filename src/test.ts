import { compress, decompress } from "./core/hexText";

function getButton(id: string) {
    return document.getElementById(id) as HTMLButtonElement;
}

function getTextArea(id: string) {
    return document.getElementById(id) as HTMLTextAreaElement;
}
function getSpan(id: string) {
    return document.getElementById(id) as HTMLSpanElement;
}

function setCount(element: HTMLTextAreaElement, id: string) {
    const text = element.value;
    const length = text.length;
    getSpan(id).innerText = length.toString();
}

function setup() {
    const buttonCompress = getButton("button-compress");
    const buttonDecompress = getButton("button-decompress");

    const textareaText = getTextArea("textarea-text");
    const textareaCompressed = getTextArea("textarea-compressed");
    const textareaDecompressed = getTextArea("textarea-decompressed");

    function setCounts() {
        setCount(textareaText, "span-count-text");
        setCount(textareaCompressed, "span-count-compressed");
        setCount(textareaDecompressed, "span-count-decompressed");
    }

    buttonCompress.onclick = async () => {
        const text = textareaText.value;
        const compressed = await compress(text);
        textareaCompressed.value = compressed;
        setCounts();
    };

    buttonDecompress.onclick = async () => {
        const compressed = textareaCompressed.value;
        const decompressed = await decompress(compressed);
        textareaDecompressed.value = decompressed;
        setCounts();
    };
}

setup();
