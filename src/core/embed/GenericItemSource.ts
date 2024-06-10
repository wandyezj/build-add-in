/**
 * Source of data from embed snips in a document.
 */
/**
 * Generic Source of items.
 */
export interface GenericItemSource<Item extends { id: string }, ItemMetadata> {
    /**
     * read all metadata -> ItemMetadata[]
     */
    getAllItemMetadata(): Promise<ItemMetadata[]>;

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
