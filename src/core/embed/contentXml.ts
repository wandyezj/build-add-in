import { compress, decompress } from "./hexText";

/*
 * text is compressed to a hexText string to avoid issues with xml tags.
 */
export async function createContentXml(tagName: string, namespaceName: string, text: string): Promise<string> {
    const content = await compress(text);
    const xml = `<?xml version="1.0"?><${tagName} xmlns="${namespaceName}">${content}</${tagName}>`;
    return xml;
}
export async function parseContentXml(tagName: string, xml: string): Promise<string> {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const element = xmlDoc.getElementsByTagName(tagName);
    const content = element[0].innerHTML;

    const text = await decompress(content);
    return text;
}
