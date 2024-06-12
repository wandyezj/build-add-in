import {
    deleteItemByIdForDatabase,
    saveItemForDatabase,
    getAllItemMetadataForDatabase,
    getItemByIdForDatabase,
} from "../database/database";
import { GenericItem, GenericItemMetadata, GenericItemSource } from "./GenericItemSource";

/**
 * Get an indexedDb source.
 * Get a source to manage a collection of items in an indexedDb table.
 * note: the database will need to be created separately.
 */
export function getSourceIndexedDb<Item extends GenericItem, ItemMetadata extends GenericItemMetadata>(parameters: {
    databaseName: string;
    databaseTableName: string;
    databaseVersion: number;
    pruneItemToItemMetadata: (item: Item) => ItemMetadata;
    getItemJson: (item: Item) => string;
    getItemFromJson: (data: string) => Item | undefined;
}): GenericItemSource<Item, ItemMetadata> {
    const { databaseName, databaseTableName, databaseVersion, pruneItemToItemMetadata, getItemJson, getItemFromJson } =
        parameters;

    const databaseSpec = {
        databaseName,
        databaseTableName,
        databaseVersion,
    };

    async function getAllItemMetadata() {
        return getAllItemMetadataForDatabase(databaseSpec, pruneItemToItemMetadata);
    }

    async function saveItem(item: Item) {
        return saveItemForDatabase(databaseSpec, item);
    }

    async function deleteItemById(id: string) {
        return deleteItemByIdForDatabase(databaseSpec, id);
    }

    async function getItemById(id: string) {
        return getItemByIdForDatabase<Item>(databaseSpec, id);
    }

    return {
        getAllItemMetadata,
        saveItem,
        getItemById,
        deleteItemById,
    };
}
