/**
 * converts text to gzip compressed hexText
 * @param text - a string
 * @returns gzip compressed hexText
 */
export async function compress(text: string): Promise<string> {
    // https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream

    const stream = new Blob([text], {
        type: "text/plain",
    }).stream();

    const compressedReadableStream = stream.pipeThrough(new CompressionStream("gzip"));
    const response = new Response(compressedReadableStream);

    const buffer = await response.arrayBuffer();
    const compressedHexText = convertBufferToHex(buffer);
    return compressedHexText;
}

/**
 * converts gzip compressed hexText to text
 * @param compressedHexText - gzip compressed hexText
 * @returns text
 */
export async function decompress(compressedHexText: string): Promise<string> {
    const buffer = convertHexToBuffer(compressedHexText);

    const stream = new Blob([buffer]).stream();
    const decompressedReadableStream = stream.pipeThrough(new DecompressionStream("gzip"));
    const response = new Response(decompressedReadableStream);
    const text = await response.text();

    return text;
}
/**
 * converts an ArrayBuffer to hexText
 */
function convertBufferToHex(buffer: ArrayBuffer): string {
    // https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
    return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

/**
 * converts hexText to ArrayBuffer
 * @param hexText - hexadecimal text to convert to an array buffer
 */
function convertHexToBuffer(hexText: string): ArrayBuffer {
    assertStringRange(hexText, "0123456789abcdef");

    if (hexText.length % 2 !== 0) {
        throw new RangeError("hexText must be an even number of characters");
    }

    const view = new Uint8Array(hexText.length / 2);

    let index = 0;
    for (let i = 0; i < hexText.length; i += 2) {
        // next pair of hex characters
        // two hex characters, 8 bits
        const pair = hexText.substring(i, i + 2);
        const bits = parseInt(pair, 16);

        // insert bits into the buffer at the next position
        view[index] = bits;
        index++;
    }

    const buffer = view.buffer;

    return buffer;
}

function assertString(variable: unknown) {
    if (typeof variable !== "string") {
        throw new TypeError("variable must be a string");
    }
}

/**
 * check that string is only made up of valid characters
 * @param check - string to check
 * @param valid - string of valid characters
 */
function assertStringRange(check: string, valid: string) {
    assertString(check);
    assertString(valid);

    const validCharacters = Array.from(valid);

    // filter out invalid characters, remove duplicate spaces, map spaces to underscores
    const invalid = Array.from(check).filter((c) => !validCharacters.includes(c));
    if (invalid.length > 0) {
        throw new RangeError(`Invalid characters in string: [${invalid.join("")}]`);
    }
}
