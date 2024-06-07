import { compress, decompress } from "./hexText";

/*
 * text is compressed to a hexText string to avoid issues with xml tags.
 */
export async function createContentXml(tagName: string, namespaceName: string, text: string): Promise<string> {
    const content = await compress(text);
    const xml = `<?xml version="1.0"?><${tagName} xmlns="${namespaceName}">${content}</${tagName}>`;
    return xml;
}
export async function parseContentXml(tagName: string, xml: string): Promise<string | undefined> {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const element = xmlDoc.getElementsByTagName(tagName);

    const firstElement = element[0];
    if (firstElement === null) {
        // There is no tag that matches the requested tag.
        return undefined;
    }

    const content = firstElement.innerHTML;

    const text = await decompress(content);
    return text;
}
