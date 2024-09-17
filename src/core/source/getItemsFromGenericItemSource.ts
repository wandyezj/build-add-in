import { removeUndefined } from "../array/removeUndefined";
import { GenericItem, GenericItemMetadata, GenericItemSource } from "./GenericItemSource";

/**
 * Get all items from the generic source.
 * Requires the source implement `getAllItemMetadata` and `getItemById`.
 * @param source - A generic item source.
 */
export async function getItemsFromGenericItemSource<Item extends GenericItem, ItemMetadata extends GenericItemMetadata>(
    source: GenericItemSource<Item, ItemMetadata>
): Promise<Item[]> {
    const itemsMetadata = await source.getAllItemMetadata();
    const promises = itemsMetadata.map(({ id }) => {
        return source.getItemById(id);
    });
    const results = await Promise.all(promises);

    // If any items failed to load remove them.
    const items = removeUndefined(results);
    return items;
}
