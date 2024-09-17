import { GenericItem, GenericItemMetadata, GenericItemSource } from "./GenericItemSource";

/**
 * Get all items from the generic source.
 * Requires the source implement `getAllItemMetadata` and `getItemById`.
 * @param source - A generic item source.
 */
export async function saveItemsToGenericItemSource<Item extends GenericItem, ItemMetadata extends GenericItemMetadata>(
    source: GenericItemSource<Item, ItemMetadata>,
    items: Item[]
): Promise<Item[]> {
    const promises = items.map((item) => source.saveItem(item));

    const savedItems = await Promise.all(promises);

    return savedItems;
}
