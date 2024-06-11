import { Snip, SnipMetadata, getSnipFromJson, getSnipJson, pruneSnipToSnipMetadata } from "../Snip";
import { getSourceEmbed } from "../source/getSourceEmbed";

//
// Manage snips embedded in the document.
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

export const embedNamespace = "build-add-in-snip";
export const embedTag = "snip";

export const source = getSourceEmbed<Snip, SnipMetadata>({
    embedNamespace,
    embedTag,
    pruneItemToItemMetadata: pruneSnipToSnipMetadata,
    getItemJson: getSnipJson,
    getItemFromJson: getSnipFromJson,
});

export const getAllSnipMetadata = source.getAllItemMetadata;
export const saveSnip = source.saveItem;
export const getSnipById = source.getItemById;
export const deleteSnipById = source.deleteItemById;
