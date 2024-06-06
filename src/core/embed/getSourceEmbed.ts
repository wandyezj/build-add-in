import { createContentXml, parseContentXml } from "./contentXml";
import { embedReadAllId, embedSave, embedDeleteById, embedReadId } from "./embed";

/**
 * Source of data from embed snips in a document.
 */

/**
 * Generic Source of items.
 */
interface Source<Item extends { id: string }, ItemMetadata> {
    /**
     * read all metadata -> ItemMetadata[]
     */
    getAllItemMetadata<T>(): Promise<ItemMetadata[]>;

    /**
     *
     * @param item
     */
    saveItem(item: Readonly<Item>): Promise<Item>;

    /**
     *
     * @param id
     */
    getItemById(id: string): Promise<Item | undefined>;

    /**
     *
     * @param id
     */
    deleteItemById(id: string): Promise<void>;
}

/*
getAllItemMetadata
    read all metadata -> SnipMetadata[]

saveItem
    create -> Item
    update by id
    save can create an empty xml part, get the id, then apply the id to the item and save it.

getItemById
    read by id -> Item

deleteItemById
    delete by id
*/

/**
 * Get an embed source.
 * Get a source to manage a collection of items embedded in the document.
 */
export function getSourceEmbed<Item extends { id: string }, ItemMetadata>(parameters: {
    embedNamespace: string;
    embedTag: string;
    pruneItemToItemMetadata: (item: Item) => ItemMetadata;
    getItemJson: (item: Item) => string;
    getItemFromJson: (data: string) => Item;
}): Source<Item, ItemMetadata> {
    const { embedNamespace, embedTag, pruneItemToItemMetadata, getItemJson, getItemFromJson } = parameters;

    async function getAllItemMetadata(): Promise<ItemMetadata[]> {
        const ids = await embedReadAllId({ embedNamespace });
        const promises = ids.map(async (id) => {
            // read each id individually
            const item = await readId({ id, embedTag });
            if (item === undefined) {
                return undefined;
            }
            const metadata = pruneItemToItemMetadata(item);
            return metadata;
        });

        const results = await Promise.all(promises);
        const metadata = results.filter((result) => result !== undefined) as ItemMetadata[];
        return metadata;
    }

    async function getItemById(id: string): Promise<Item | undefined> {
        const snip = await readId({ id, embedTag });
        return snip;
    }

    async function saveItem(item: Readonly<Item>): Promise<Item> {
        const targetId = item.id;
        // Id is the id of the custom xml part.
        const text = getItemJson({ ...item, id: "" });
        const xml = await createContentXml(embedTag, embedNamespace, text);
        const id = await embedSave({ xml, id: targetId, embedNamespace });
        return { ...item, id };
    }

    async function deleteItemById(id: string): Promise<void> {
        // Different on different hosts.
        await embedDeleteById({ id, embedNamespace });
    }

    async function readId({ id, embedTag }: { id: string; embedTag: string }): Promise<Item | undefined> {
        const xml = await embedReadId(id);
        if (xml === undefined) {
            return undefined;
        }

        const snipJson = await parseContentXml(embedTag, xml);
        const snip = getItemFromJson(snipJson);
        if (snip === undefined) {
            return undefined;
        }
        snip.id = id;
        return snip;
    }

    return {
        getAllItemMetadata,
        getItemById,
        saveItem,
        deleteItemById,
    };
}
