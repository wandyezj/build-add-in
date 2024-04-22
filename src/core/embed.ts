import { Snip, SnipMetadata, getSnipFromJson, getSnipJson, pruneSnipToSnipMetadata } from "./Snip";
import { getHost } from "./globals";
import { compress, decompress } from "./hexText";

//
// Manage snips embedded in the document.
//

/*
getAllSnipMetadata
    read all metadata -> SnipMetadata[]

saveSnip
    create -> Snip
    update by id
    save can create an empty xml part, get the id, then apply the id to the snip and save it.

getSnipById
    read by id -> Snip

deleteSnipById
    delete by id

TODO: underlying functions need to work on every host.
https://learn.microsoft.com/en-us/javascript/api/office/office.customxmlpart?view=common-js-preview
*/

export async function getAllSnipMetadata(): Promise<SnipMetadata[]> {
    const ids = await embedReadAllId();
    const promises = ids.map(async (id) => {
        // read each id individually
        const snip = await readId(id);
        if (snip === undefined) {
            return undefined;
        }
        const metadata = pruneSnipToSnipMetadata(snip);
        return metadata;
    });

    const results = await Promise.all(promises);
    const metadata = results.filter((result) => result !== undefined) as SnipMetadata[];
    return metadata;
}

export async function getSnipById(id: string): Promise<Snip | undefined> {
    const snip = await readId(id);
    return snip;
}

export async function saveSnip(snip: Readonly<Snip>): Promise<Snip> {
    const targetId = snip.id;
    // Id is the id of the custom xml part.
    const text = getSnipJson({ ...snip, id: "" });
    const xml = await createContentXml(embedSnipTag, embedSnipNamespace, text);
    const id = await embedSave({ xml, id: targetId });
    return { ...snip, id };
}

export async function deleteSnipById(id: string): Promise<void> {
    // Different on different hosts.
    await embedDeleteById(id);
}

// const xml = await createContentXml(embedSnipTag, embedSnipNamespace, data);

const embedSnipNamespace = "build-add-in-snip";
const embedSnipTag = "snip";

async function readId(id: string): Promise<Snip | undefined> {
    const xml = await embedReadId(id);
    if (xml === undefined) {
        return undefined;
    }

    const snipJson = await parseContentXml(embedSnipTag, xml);
    const snip = getSnipFromJson(snipJson);
    if (snip === undefined) {
        return undefined;
    }
    snip.id = id;
    return snip;
}

/**
 *
 * @returns id of the saved snip
 */
async function embedSave({ xml, id }: { xml: string; id: string }): Promise<string> {
    return await Excel.run(async (context) => {
        const customXmlParts = context.workbook.customXmlParts;
        let item;
        if (id === undefined) {
            item = customXmlParts.add(xml);
        } else {
            const collection = customXmlParts.getByNamespace(embedSnipNamespace);
            item = collection.getItemOrNullObject(id);
            item.setXml(xml);
            await context.sync();
            if (item.isNullObject) {
                item = customXmlParts.add(xml);
            }
        }
        item.load("id");
        await context.sync();
        const itemId = item.id;
        return itemId;
    });
}

async function embedDeleteById(id: string): Promise<void> {
    const callback = embedDeleteByIdGenericCallback(id);
    await callGenericCallbackForHost(callback);
}

async function callGenericCallbackForHost<T>(callback: GenericCallback<T>): Promise<T> {
    const host = getHost();
    switch (host) {
        case Office.HostType.Excel:
            return await Excel.run(async (context) => {
                const customXmlParts = context.workbook.customXmlParts;
                return callback(context, customXmlParts);
            });
        case Office.HostType.Word:
            return await Word.run(async (context) => {
                const customXmlParts = context.document.customXmlParts;
                return callback(context, customXmlParts);
            });

        default:
            // PowerPoint does not yet support custom xml parts.
            throw new Error("Host not supported");
    }
}

interface GenericContext {
    sync(): Promise<void>;
}

interface GenericCustomXmlPartCollection {
    getByNamespace(namespace: string): GenericCustomXmlPartScopedCollection;
}

interface GenericCustomXmlPartScopedCollection {
    getItemOrNullObject(id: string): GenericCustomXmlPart;
}

interface GenericCustomXmlPart {
    id: string;
    getXml(): { value: string };
    setXml(xml: string): void;
    delete(): void;
}

type GenericCallback<T> = (context: GenericContext, customXmlParts: GenericCustomXmlPartCollection) => Promise<T>;

function embedDeleteByIdGenericCallback(id: string) {
    return async function (context: GenericContext, customXmlParts: GenericCustomXmlPartCollection) {
        const collection = customXmlParts.getByNamespace(embedSnipNamespace);
        const item = collection.getItemOrNullObject(id);
        item.delete();
        return context.sync();
    };
}

/**
 * read all ids available to read
 */
async function embedReadAllId(): Promise<string[]> {
    return await Excel.run(async (context) => {
        const customXmlParts = context.workbook.customXmlParts;
        const collection = customXmlParts.getByNamespace(embedSnipNamespace);
        collection.load(["items", "items/id"]);
        await context.sync();

        const ids = collection.items.map((item) => {
            const id = item.id;
            return id;
        });

        return ids;
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

// async function embedDeleteById(id: string): Promise<void> {
//     // Different on different hosts.
//     return await Excel.run(async (context) => {
//         const customXmlParts = context.workbook.customXmlParts;
//         const collection = customXmlParts.getByNamespace(embedSnipNamespace);
//         const item = collection.getItemOrNullObject(id);
//         item.delete();
//         await context.sync();
//     });
// }

// /**
//  * Add
//  * @param data
//  * @returns id
//  */
// async function embedAddXml(xml: string): Promise<string> {
//     // Different on different hosts.
//     return await Excel.run(async (context) => {
//         const customXmlParts = context.workbook.customXmlParts;
//         const item = customXmlParts.add(xml);
//         item.load("id");
//         await context.sync();
//         const itemId = item.id;
//         return itemId;
//     });
// }

// /**
//  * Add
//  * @param data
//  * @returns id
//  */
// async function embedUpdateXml(id: string, xml: string): Promise<void> {
//     // Different on different hosts.
//     return await Excel.run(async (context) => {
//         const customXmlParts = context.workbook.customXmlParts;
//         const collection = customXmlParts.getByNamespace(embedSnipNamespace);
//         const item = collection.getItemOrNullObject(id);
//         item.setXml(xml);
//         await context.sync();
//     });
// }

// async function embedReadAll(): Promise<{ id: string; xml: string }[]> {
//     return await Excel.run(async (context) => {
//         const customXmlParts = context.workbook.customXmlParts;
//         const collection = customXmlParts.getByNamespace(embedSnipNamespace);
//         collection.load(["items", "items/id"]);
//         // TODO: can fail if there is too much data.
//         // can split this by reading all id data individually.
//         const results = collection.items.map((item) => {
//             const id = item.id;
//             const result = item.getXml();
//             return { id, result };
//         });
//         await context.sync();

//         const items = results.map((item) => {
//             const id = item.id;
//             const xml = item.result.value;
//             return { id, xml };
//         });

//         return items;
//     });
// }

/*
 * text is compressed to a hexText string to avoid issues with xml tags.
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
