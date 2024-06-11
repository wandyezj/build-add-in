import { GenericItemSource } from "./GenericItemSource";

/**
 * Get a localStorage source.
 * Get a source to manage a collection of items in local storage.
 * All items are stored under a single local storage key.
 */
export function getSourceLocalStorage<Item extends { id: string }, ItemMetadata extends { id: string }>(parameters: {
    key: string;
    pruneItemToItemMetadata: (item: Item) => ItemMetadata;
    getItemJson: (item: Item) => string;
    getItemFromJson: (data: string) => Item | undefined;
}): GenericItemSource<Item, ItemMetadata> {
    const { key, pruneItemToItemMetadata, getItemJson, getItemFromJson } = parameters;

    function saveAllItems(items: { [id: string]: string }) {
        const value = JSON.stringify(items, null, 4);
        window.localStorage.setItem(key, value);
    }

    function getAllItems(): { [id: string]: string } {
        const value = window.localStorage.getItem(key);
        if (value === null) {
            return {};
        }

        const items = JSON.parse(value) as { [id: string]: string };
        return items;
    }

    function readId({ id }: { id: string }): Item | undefined {
        const storage = getAllItems();
        const match = storage[id];
        if (match === undefined) {
            return undefined;
        }
        const item = getItemFromJson(match);
        if (item === undefined) {
            return undefined;
        }

        item.id = id;
        return item;
    }

    async function getAllItemMetadata(): Promise<ItemMetadata[]> {
        const items = getAllItems();

        const results = Object.getOwnPropertyNames(items).map((id) => {
            const itemJson = items[id];
            const item = getItemFromJson(itemJson);
            if (item === undefined) {
                return undefined;
            }

            item.id = id;
            const metadata = pruneItemToItemMetadata(item);
            return metadata;
        });

        const metadata = results.filter((result) => result !== undefined) as ItemMetadata[];
        return metadata;
    }

    async function getItemById(id: string): Promise<Item | undefined> {
        const item = readId({ id });
        return item;
    }

    async function saveItem(item: Readonly<Item>): Promise<Item> {
        const { id } = item;

        const text = getItemJson({ ...item, id });
        const items = getAllItems();
        items[id] = text;
        saveAllItems(items);

        return item;
    }

    async function deleteItemById(id: string): Promise<void> {
        const items = getAllItems();
        delete items[id];
        saveAllItems(items);
    }

    return {
        getAllItemMetadata,
        getItemById,
        saveItem,
        deleteItemById,
    };
}
