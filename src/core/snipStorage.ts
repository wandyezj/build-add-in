import { Snip, SnipReference, SnipWithSource } from "./Snip";

import {
    saveSnip as saveSnipInDatabase,
    deleteSnipById as deleteSnipByIdInDatabase,
    getSnipById as getSnipByIdInDatabase,
} from "./database";
import {
    saveSnip as saveSnipInEmbed,
    deleteSnipById as deleteSnipByIdInEmbed,
    getSnipById as getSnipByIdInEmbed,
} from "./source/embedSnip";

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
