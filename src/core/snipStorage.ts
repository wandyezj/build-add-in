import { Snip, SnipMetadata, SnipMetadataWithSource, SnipReference, SnipSource, SnipWithSource } from "./Snip";

import {
    getAllSnipMetadata as getAllSnipMetadataInDatabase,
    saveSnip as saveSnipInDatabase,
    deleteSnipById as deleteSnipByIdInDatabase,
    getSnipById as getSnipByIdInDatabase,
} from "./database";
import {
    getAllSnipMetadata as getAllSnipMetadataInEmbed,
    saveSnip as saveSnipInEmbed,
    deleteSnipById as deleteSnipByIdInEmbed,
    getSnipById as getSnipByIdInEmbed,
} from "./source/embedSnip";

//
// Deal with storage based on the snip source.
//

export async function getAllSnipMetadata(source: SnipSource): Promise<SnipMetadataWithSource[]> {
    let metadata: SnipMetadata[] = [];
    switch (source) {
        case "local":
            metadata = await getAllSnipMetadataInDatabase();
            break;
        case "embed":
            metadata = await getAllSnipMetadataInEmbed();
            break;
    }
    const metadataWithSource = metadata.map((m) => ({ ...m, source }));
    return metadataWithSource;
}

export async function saveSnip(snip: SnipWithSource): Promise<SnipWithSource> {
    const saved = await saveSnipToSource(snip);
    return { ...saved, source: snip.source };
}

async function saveSnipToSource(snip: SnipWithSource): Promise<Snip> {
    switch (snip.source) {
        case "local":
            return saveSnipInDatabase(snip);
        case "embed":
            return saveSnipInEmbed(snip);
    }
}

export async function deleteSnipById(reference: SnipReference): Promise<void> {
    const { source, id } = reference;
    switch (source) {
        case "local":
            await deleteSnipByIdInDatabase(id);
            break;
        case "embed":
            await deleteSnipByIdInEmbed(id);
            break;
    }
}

export async function getSnipById(reference: SnipReference): Promise<SnipWithSource | undefined> {
    const { source, id } = reference;
    let snip: Snip | undefined;
    switch (source) {
        case "local":
            snip = await getSnipByIdInDatabase(id);
            break;
        case "embed":
            snip = await getSnipByIdInEmbed(id);
            break;
    }
    if (snip === undefined) {
        return undefined;
    }
    return { ...snip, source };
}
