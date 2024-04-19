/* eslint-disable */
//
// Manage snips embedded in the document.
//

//import { PrunedSnip, Snip, getSnipJson } from "./Snip";
import { compress, decompress } from "./hexText";

//
// - read all metadata -> SnipMetadata[]
//     - getAllSnipMetadata
// - create -> Snip
//     - saveSnip
// - read by id -> Snip
//     - getSnipById
// - update by id
// - delete by id
//     - deleteSnipById
//

// export async function embedSnip(snip: PrunedSnip): Promise<Snip> {
//     const text = getSnipJson(snip);

//     // want to overwrite id
//     // Different calls depending on the application
// }

// too difficult to deal with embedded html

const embedSnipNamespace = "build-add-in-snip";
const embedSnipTag = "snip";

/**
 * Add
 * @param data
 * @returns
 */
async function embedAdd(data: string): Promise<string> {
    const xml = await createContentXml(embedSnipTag, embedSnipNamespace, data);

    // Different on different hosts.
    return await Excel.run(async (context) => {
        const customXmlParts = context.workbook.customXmlParts;
        const item = customXmlParts.add(xml);
        item.load("id");
        await context.sync();
        const itemId = item.id;
        return itemId;
    });
}

/**
 * read all ids available to read
 */
async function embedReadAllId(): Promise<string[]> {
    return await Excel.run(async (context) => {
        const customXmlParts = context.workbook.customXmlParts;
        const collection = customXmlParts.getByNamespace(embedSnipNamespace);
        collection.load(["items", "items/id"]);

        const results = collection.items.map((item) => {
            const id = item.id;
            const result = item.getXml();
            return { id, result };
        });
        await context.sync();

        const items = results.map((item) => {
            const id = item.id;
            return id;
        });

        return items;
    });
}

/**
 * read the specific ids data or undefined if it does not exist.
 * @param id
 */
async function embedReadId(id: string): Promise<string | undefined> {
    return await Excel.run(async (context) => {
        const customXmlParts = context.workbook.customXmlParts;
        const item = customXmlParts.getItemOrNullObject(id);
        const result = item.getXml();
        await context.sync();
        if (item.isNullObject) {
            return undefined;
        }
        const data = result.value;
        return data;
    });
}

async function embedReadAll(): Promise<{ id: string; xml: string }[]> {
    return await Excel.run(async (context) => {
        const customXmlParts = context.workbook.customXmlParts;
        const collection = customXmlParts.getByNamespace(embedSnipNamespace);
        collection.load(["items", "items/id"]);
        // TODO: can fail if there is too much data.
        // can split this by reading all id data individually.
        const results = collection.items.map((item) => {
            const id = item.id;
            const result = item.getXml();
            return { id, result };
        });
        await context.sync();

        const items = results.map((item) => {
            const id = item.id;
            const xml = item.result.value;
            return { id, xml };
        });

        return items;
    });
}

//const xml = `<?xml version="1.0"?><${embedSnipTag} xmlns="${embedSnipNamespace}">${text}</Embed>`;

/*
 * text is compressed to a hexText string to avoid issues with
 */
async function createContentXml(tagName: string, namespaceName: string, text: string): Promise<string> {
    const content = await compress(text);
    const xml = `<?xml version="1.0"?><${tagName} xmlns="${namespaceName}">${content}</${tagName}>`;
    return xml;
}

async function parseContentXml(tagName: string, xml: string): Promise<string> {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const element = xmlDoc.getElementsByTagName(tagName);
    const content = element[0].innerHTML;

    const text = await decompress(content);
    return text;
}
