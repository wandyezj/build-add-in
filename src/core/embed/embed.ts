import { getHost } from "../globals";

//
// Functions to manipulate embed xml that work across Excel and Word.
//
// embedDeleteById
// embedSave
// embedReadAllId
// embedReadId
//

async function callGenericCallbackForHost<T>(callback: GenericCallback<T>): Promise<T> {
    const host = getHost();
    switch (host) {
        case Office.HostType.Excel:
            // delayForCellEdit
            // https://learn.microsoft.com/en-us/office/dev/add-ins/excel/excel-add-ins-delay-in-cell-edit
            // Delay for cell edit so the call does not fail due to cell edit mode.
            // In practice this should only be called when already in the editor so it should be rare.
            return await Excel.run({ delayForCellEdit: true }, async (context) => {
                const customXmlParts = context.workbook.customXmlParts;
                return callback(context, customXmlParts);
            });
        case Office.HostType.Word:
            return await Word.run(async (context) => {
                const customXmlParts = context.document.customXmlParts;
                return callback(context, customXmlParts);
            });

        default:
            // PowerPoint does not yet support custom xml parts.
            throw new Error("Host not supported");
    }
}

interface GenericContext {
    sync(): Promise<void>;
}

interface GenericCustomXmlPartCollection {
    getByNamespace(namespace: string): GenericCustomXmlPartScopedCollection;
    add(xml: string): GenericCustomXmlPart;
    getItemOrNullObject(id: string): GenericCustomXmlPart;
}

interface GenericCustomXmlPartScopedCollection {
    getItemOrNullObject(id: string): GenericCustomXmlPart;
    load(values: ("items" | "items/id")[]): void;
    items: GenericCustomXmlPart[];
}

interface GenericCustomXmlPart {
    id: string;
    isNullObject: boolean;
    load(property: "id"): void;
    getXml(): { value: string };
    setXml(xml: string): void;
    delete(): void;
}

type GenericCallback<T> = (context: GenericContext, customXmlParts: GenericCustomXmlPartCollection) => Promise<T>;

export async function embedDeleteById({ id, embedNamespace }: { id: string; embedNamespace: string }): Promise<void> {
    const callback = embedDeleteByIdGenericCallback({ id, embedNamespace });
    await callGenericCallbackForHost(callback);
}

function embedDeleteByIdGenericCallback({ id, embedNamespace }: { id: string; embedNamespace: string }) {
    return async function (context: GenericContext, customXmlParts: GenericCustomXmlPartCollection) {
        const collection = customXmlParts.getByNamespace(embedNamespace);
        const item = collection.getItemOrNullObject(id);
        item.delete();
        return context.sync();
    };
}

/**
 * @returns id of the saved snip
 */
export async function embedSave({
    xml,
    id,
    embedNamespace,
}: {
    xml: string;
    id: string;
    embedNamespace: string;
}): Promise<string> {
    const callback = embedSaveGenericCallback({ xml, id, embedNamespace });
    const value = await callGenericCallbackForHost(callback);
    return value;
}

function embedSaveGenericCallback({ xml, id, embedNamespace }: { xml: string; id: string; embedNamespace: string }) {
    return async function (context: GenericContext, customXmlParts: GenericCustomXmlPartCollection) {
        let item;

        if (id === undefined) {
            // Create a new item
            item = customXmlParts.add(xml);
        } else {
            // Attempt to update the existing item with the id.
            const collection = customXmlParts.getByNamespace(embedNamespace);
            item = collection.getItemOrNullObject(id);
            item.setXml(xml);
            await context.sync();
            if (item.isNullObject) {
                // If the item does not exist, create a new one.
                item = customXmlParts.add(xml);
            }
        }

        // Get the id of the item
        item.load("id");
        await context.sync();
        const itemId = item.id;
        return itemId;
    };
}

/**
 * read all ids available to read
 */
export async function embedReadAllId({ embedNamespace }: { embedNamespace: string }): Promise<string[]> {
    const callback = embedReadAllIdGenericCallback({ embedNamespace });
    const value = await callGenericCallbackForHost(callback);
    return value;
}

/**
 * read all ids available to read
 */
function embedReadAllIdGenericCallback({ embedNamespace }: { embedNamespace: string }) {
    return async function (context: GenericContext, customXmlParts: GenericCustomXmlPartCollection) {
        const collection = customXmlParts.getByNamespace(embedNamespace);
        collection.load(["items", "items/id"]);
        await context.sync();

        const ids = collection.items.map((item) => {
            const id = item.id;
            return id;
        });

        return ids;
    };
}

/**
 * read the specific ids data or undefined if it does not exist.
 * @param id
 */
export async function embedReadId(id: string): Promise<string | undefined> {
    const callback = embedReadIdGenericCallback(id);
    const value = await callGenericCallbackForHost(callback);
    return value;
}

/**
 * read the specific ids data or undefined if it does not exist.
 * @param id
 */
function embedReadIdGenericCallback(id: string): GenericCallback<string | undefined> {
    return async function (context: GenericContext, customXmlParts: GenericCustomXmlPartCollection) {
        const item = customXmlParts.getItemOrNullObject(id);
        const result = item.getXml();
        await context.sync();
        if (item.isNullObject) {
            return undefined;
        }
        const data = result.value;
        return data;
    };
}
