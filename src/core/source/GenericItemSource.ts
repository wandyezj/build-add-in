/**
 * Interface to describe a generic source of items.
 */

export interface GenericItem {
    id: string;
}

export interface GenericItemMetadata {
    id: string;
}

/**
 * Generic source of items.
 * Each stored item has a unique id to reference the item in the source.
 */
export interface GenericItemSource<Item extends GenericItem, ItemMetadata extends GenericItemMetadata> {
    /**
     * Get metadata of all items in the source.
     * The metadata includes the source id property to reference the item.
     * @returns Metadata of all items in the source.
     */
    getAllItemMetadata(): Promise<ItemMetadata[]>;

    /**
     * Create or Update an item.
     * Save an item to the source.
     * @param item - Item to save. If the item has an id, the item with that id is updated. If the id is not already present a new id is generated.
     * @returns The stored item including an source id property to reference the item.
     */
    saveItem(item: Readonly<Item>): Promise<Item>;

    /**
     * Read an item.
     * Get an item by source id.
     * @param id - Id returned by save item.
     * @returns The item associated with the id or undefined.
     */
    getItemById(id: string): Promise<Item | undefined>;

    /**
     * Delete an item.
     * delete an item by source id.
     * @param id - Id returned by save item.
     */
    deleteItemById(id: string): Promise<void>;
}
