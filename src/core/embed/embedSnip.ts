import { Snip, SnipMetadata, getSnipFromJson, getSnipJson, pruneSnipToSnipMetadata } from "../Snip";
import { createContentXml, parseContentXml } from "./contentXml";
import { embedReadAllId, embedSave, embedDeleteById, embedReadId } from "./embed";

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

export async function getAllSnipMetadata(): Promise<SnipMetadata[]> {
    const ids = await embedReadAllId({ embedNamespace });
    const promises = ids.map(async (id) => {
        // read each id individually
        const snip = await readId({ id, embedTag });
        if (snip === undefined) {
            return undefined;
        }
        const metadata = pruneSnipToSnipMetadata(snip);
        return metadata;
    });

    const results = await Promise.all(promises);
    const metadata = results.filter((result) => result !== undefined) as SnipMetadata[];
    return metadata;
}

export async function getSnipById(id: string): Promise<Snip | undefined> {
    const snip = await readId({ id, embedTag });
    return snip;
}

export async function saveSnip(snip: Readonly<Snip>): Promise<Snip> {
    const targetId = snip.id;
    // Id is the id of the custom xml part.
    const text = getSnipJson({ ...snip, id: "" });
    const xml = await createContentXml(embedTag, embedNamespace, text);
    const id = await embedSave({ xml, id: targetId, embedNamespace });
    return { ...snip, id };
}

export async function deleteSnipById(id: string): Promise<void> {
    // Different on different hosts.
    await embedDeleteById({ id, embedNamespace });
}

async function readId({ id, embedTag }: { id: string; embedTag: string }): Promise<Snip | undefined> {
    const xml = await embedReadId(id);
    if (xml === undefined) {
        return undefined;
    }

    const snipJson = await parseContentXml(embedTag, xml);
    if (snipJson === undefined) {
        return undefined;
    }
    const snip = getSnipFromJson(snipJson);
    if (snip === undefined) {
        return undefined;
    }
    snip.id = id;
    return snip;
}
