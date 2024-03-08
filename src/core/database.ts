// Indexed DB database

import { Snip } from "./Snip";
import { defaultSnip } from "./defaultSnip";

// Key, Name, SnipJson

const databaseName = "extension";
const databaseVersion = 1;

const databaseTableNameSnips = "snips";
const databaseTableNameSnipsIndexName = "name";

async function openDatabase() {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(databaseName, databaseVersion);

        request.onupgradeneeded = (event) => {
            const target = event.target;
            if (target instanceof IDBOpenDBRequest) {
                const db = target.result;

                // id is the unique key, it is unique to the local storage
                const objectStore = db.createObjectStore(databaseTableNameSnips, {
                    keyPath: "id",
                    autoIncrement: true,
                });
                objectStore.createIndex("name", "name", { unique: false });

                objectStore.transaction.oncomplete = () => {
                    // Store values in the newly created objectStore.
                    const snipsObjectStore = db
                        .transaction(databaseTableNameSnips, "readwrite")
                        .objectStore(databaseTableNameSnips);

                    // default snip
                    snipsObjectStore.add(defaultSnip);
                };
            }
        };

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function () {
            reject(request.error);
        };
    });
}

function getTableSnips(db: IDBDatabase) {
    return db.transaction(databaseTableNameSnips, "readwrite").objectStore(databaseTableNameSnips);
}

export async function getSnipIdentifiers(): Promise<Pick<Snip, "id" | "name">[]> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const objectStore = getTableSnips(db);
        const request = objectStore.openCursor();

        const items: Pick<Snip, "id" | "name">[] = [];
        request.onsuccess = (event) => {
            const target = event.target;
            if (target instanceof IDBRequest) {
                const cursor = target.result;
                if (cursor) {
                    items.push({ id: cursor.value.id, name: cursor.value.name });
                    cursor.continue();
                } else {
                    resolve(items);
                }
            }
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
}

export async function getSnipById(id: string | undefined): Promise<Snip | undefined> {
    if (id === undefined) {
        return undefined;
    }

    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const objectStore = getTableSnips(db);
        const request = objectStore.get(id);
        request.onsuccess = (event) => {
            const target = event.target;
            if (target instanceof IDBRequest) {
                resolve(target.result);
            }
        };
        request.onerror = (event) => {
            const target = event.target;
            if (target instanceof IDBRequest) {
                reject(target.error);
            } else {
                reject("Unknown error");
            }
        };
    });
}

export async function getSnipByName(name: string): Promise<Snip | undefined> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const objectStore = getTableSnips(db);
        const index = objectStore.index(databaseTableNameSnipsIndexName);
        const request = index.get(name);
        request.onsuccess = (event) => {
            const target = event.target;
            if (target instanceof IDBRequest) {
                resolve(target.result);
            }
        };
        request.onerror = (event) => {
            const target = event.target;
            if (target instanceof IDBRequest) {
                reject(target.error);
            } else {
                reject("Unknown error");
            }
        };
    });
}
