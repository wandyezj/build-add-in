import { GenericItem, GenericItemMetadata, GenericItemSource } from "./GenericItemSource";

/**
 * Delete all items from the generic source.
 * Requires the source implement `getAllItemMetadata` and `deleteItemById`.
 * @param source - A generic item source.
 */
export async function clearGenericItemSourceStorage(source: GenericItemSource<GenericItem, GenericItemMetadata>) {
    const items = await source.getAllItemMetadata();
    const promises = items.map(({ id }) => {
        source.deleteItemById(id);
    });
    await Promise.all(promises);
}
