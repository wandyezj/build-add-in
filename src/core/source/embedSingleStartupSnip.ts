import { Snip } from "../Snip";
import { clearItemsFromGenericItemSource } from "./clearItemsFromGenericItemSource";
import { getSourceEmbed } from "./getSourceEmbed";
import { source as sourceSnip } from "./embedSnip";

//
// Manage single startup snip embedded in the document.
//
/*
getAllSnipMetadata
    read all metadata -> SnipMetadata[]

saveSnip
    create -> Snip
    update by id
    save can create an empty xml part, get the id, then apply the id to the snip and save it.

getSnipById
    read by id -> Snip

deleteSnipById
    delete by id

*/

export const embedNamespace = "build-add-in-snip-startup";
export const embedTag = "snipId";

/**
 * embedded snip id
 */
type SnipId = { id: string; snipId: string };
type SnipIdMetadata = SnipId;

export const source = getSourceEmbed<SnipId, SnipIdMetadata>({
    embedNamespace,
    embedTag,
    pruneItemToItemMetadata: (item) => {
        return { id: item.id, snipId: item.snipId };
    },
    getItemJson: (item) => {
        return JSON.stringify(item);
    },
    getItemFromJson: (item) => {
        return JSON.parse(item);
    },
});

/**
 * Save the id of an embedded snip to use for startup.
 */
export async function saveStartupSnipId(item: SnipId): Promise<SnipId> {
    // only allow a single one to save
    await clearItemsFromGenericItemSource(source);
    return await source.saveItem(item);
}

export async function getStartupSnipId(): Promise<string | undefined> {
    console.log("getStartupSnipId");
    const metadata = await source.getAllItemMetadata();
    if (metadata.length !== 1) {
        console.log("clear");
        await clearItemsFromGenericItemSource(source);
        return undefined;
    }

    const id = metadata[0].snipId;
    return id;
}

/**
 * Attempt to load the startup snip if one exists.
 */
export async function loadStartupSnip(): Promise<Snip | undefined> {
    const id = await getStartupSnipId();
    if (id === undefined) {
        return undefined;
    }
    console.log(`loadStartupSnip ${id}`);
    const snip = await sourceSnip.getItemById(id);
    return snip;
}

/**
 * Delete the id for the startup snip.
 */
export async function deleteStartupSnipId() {
    await clearItemsFromGenericItemSource(source);
}
