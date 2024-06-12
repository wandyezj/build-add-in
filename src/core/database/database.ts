// Wrapper around Indexed DB database

import { GenericItem, GenericItemMetadata } from "../source/GenericItemSource";

// Database Structure
// The unique key is the id of the snip.

/**
 *
 * @param callback called if present with the error
 */
function createErrorHandler(callback?: (error: unknown) => void) {
    return (event: Event) => {
        const target = event.target;
        let error: unknown;
        if (target instanceof IDBRequest) {
            error = target.error;
        } else {
            error = "Unknown error";
        }

        console.error(error);
        if (callback) {
            callback(error);
        }
    };
}

/**
 * Create table in a database with id as the unique key.
 * @param db - The database.
 * @param tableName - The table name.
 */
async function createTable(db: IDBDatabase, tableName: string) {
    db.createObjectStore(tableName, {
        keyPath: "id",
    });
}

/**
 * Spec for a database that contains a table of items with unique ids.
 */
export interface DatabaseSpec {
    databaseName: string;
    databaseVersion: number;
    databaseTableName: string;
    upgradeLogic?: (db: IDBDatabase, oldVersion: number) => void;
}

async function openDatabase({ databaseName, databaseVersion, databaseTableName, upgradeLogic }: DatabaseSpec) {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(databaseName, databaseVersion);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const target = event.target;
            if (target instanceof IDBOpenDBRequest) {
                const db = target.result;
                const { oldVersion } = event;
                if (upgradeLogic) {
                    // Upgrade logic
                    upgradeLogic(db, oldVersion);
                } else if (oldVersion === 0) {
                    // Default database creation logic for new databases
                    createTable(db, databaseTableName);
                } else {
                    throw new Error("No upgrade logic provided.");
                }
            }
        };

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = createErrorHandler(reject);
    });
}

function getDatabaseTable(db: IDBDatabase, databaseTableName: string, mode: IDBTransactionMode) {
    return db.transaction(databaseTableName, mode).objectStore(databaseTableName);
}

// #region Snips

/**
 * Get all items
 */
export async function getAllItemsForDatabase<Item>(databaseSpec: DatabaseSpec): Promise<Item[]> {
    const db = await openDatabase(databaseSpec);
    return new Promise((resolve, reject) => {
        const objectStore = getDatabaseTable(db, databaseSpec.databaseTableName, "readonly");
        const request = objectStore.openCursor();

        const items: Item[] = [];
        request.onsuccess = (event) => {
            const target = event.target;
            if (target instanceof IDBRequest) {
                const cursor = target.result;
                if (cursor) {
                    const item = cursor.value;
                    items.push(item);
                    cursor.continue();
                } else {
                    resolve(items);
                }
            }
        };
        request.onerror = createErrorHandler(reject);
    });
}

/**
 * Gets all snip names.
 */
export async function getAllItemMetadataForDatabase<Item extends GenericItem, ItemMetadata extends GenericItemMetadata>(
    databaseSpec: DatabaseSpec,
    pruneItemToItemMetadata: (item: Item) => ItemMetadata
): Promise<ItemMetadata[]> {
    const db = await openDatabase(databaseSpec);
    return new Promise((resolve, reject) => {
        const objectStore = getDatabaseTable(db, databaseSpec.databaseTableName, "readonly");
        const request = objectStore.openCursor();

        const items: ItemMetadata[] = [];
        request.onsuccess = (event) => {
            const target = event.target;
            if (target instanceof IDBRequest) {
                const cursor = target.result;
                if (cursor) {
                    // TODO: Make generic
                    const value = cursor.value as Item;
                    const metadata = pruneItemToItemMetadata(value);
                    items.push(metadata);
                    cursor.continue();
                } else {
                    resolve(items);
                }
            }
        };
        request.onerror = createErrorHandler(reject);
    });
}

export async function getItemByIdForDatabase<Item extends GenericItem>(
    databaseSpec: DatabaseSpec,
    id: string | undefined
): Promise<Item | undefined> {
    if (id === undefined) {
        return undefined;
    }

    const db = await openDatabase(databaseSpec);
    return new Promise((resolve, reject) => {
        const objectStore = getDatabaseTable(db, databaseSpec.databaseTableName, "readonly");
        const request = objectStore.get(id);
        request.onsuccess = (event) => {
            const target = event.target;
            if (target instanceof IDBRequest) {
                resolve(target.result);
            }
        };
        request.onerror = createErrorHandler(reject);
    });
}

export async function saveItemForDatabase<Item>(databaseSpec: DatabaseSpec, item: Item): Promise<Item> {
    const db = await openDatabase(databaseSpec);
    return new Promise((resolve, reject) => {
        const objectStore = getDatabaseTable(db, databaseSpec.databaseTableName, "readwrite");

        const request = objectStore.put(item);
        request.onsuccess = () => {
            resolve(item);
            // const target = event.target;
            // if (target instanceof IDBRequest) {
            //     resolve(target.result);
            // }
        };
        request.onerror = createErrorHandler(reject);
    });
}

export async function deleteItemByIdForDatabase(databaseSpec: DatabaseSpec, id: string): Promise<void> {
    const db = await openDatabase(databaseSpec);
    const objectStore = getDatabaseTable(db, databaseSpec.databaseTableName, "readwrite");

    return new Promise((resolve, reject) => {
        const request = objectStore.delete(id);
        request.onsuccess = () => {
            resolve();
        };
        request.onerror = createErrorHandler(reject);
    });
}
