// import {
//     getTriggerActionFromJson,
//     getTriggerActionJson,
//     pruneTriggerActionToTriggerActionMetadata,
// } from "./core/actions/TriggerAction";
// import { setTriggerActions } from "./core/actions/triggerActionHandlers";
// import { getSourceEmbed } from "./core/source/getSourceEmbed";
import { setHost } from "./core/globals";
// import { clearItemsFromGenericItemSource } from "./core/source/clearItemsFromGenericItemSource";
// import { source } from "./core/source/embedSnip";
// import { triggerActionsDefault } from "./core/actions/triggerActionsDefault";
import { TriggerManager } from "./core/actions/TriggerManager";
import { getWatch } from "./core/util/getWatch";

// Redirect immediately to shared for simpler testing.
window.location.href = "./shared.html";

console.log("actions load");

// Store triggers in custom XML

// const embedNamespace = "build-add-in-trigger-action";
// const embedTag = "TriggerAction";

// const storage = getSourceEmbed({
//     embedNamespace,
//     embedTag,
//     pruneItemToItemMetadata: pruneTriggerActionToTriggerActionMetadata,
//     getItemJson: getTriggerActionJson,
//     getItemFromJson: getTriggerActionFromJson,
// });

// import { embedDeleteById, embedReadAllId } from "./core/embed/embed";
// async function removeAllEmbedTriggers() {
//     const ids = await embedReadAllId({ embedNamespace });
//     await Promise.all(ids.map((id) => embedDeleteById({ id, embedNamespace })));
// }

Office.onReady(async ({ host }) => {
    console.log("ready");
    setHost(host);

    const watch = getWatch("boot");
    watch.start();

    //clearItemsFromGenericItemSource(source);
    await TriggerManager.initialize();
    watch.read("initialize");
    //removeAllEmbedTriggers();

    // // read triggers
    // let metadata = await storage.getAllItemMetadata();
    // watch.read("read trigger metadata");

    // if (metadata.length === 0) {
    //     console.log("save default triggers - start");
    //     // embed some triggers
    //     watch.start();
    //     await Promise.all(triggerActionsDefault.map((item) => storage.saveItem(item)));
    //     metadata = await storage.getAllItemMetadata();
    //     watch.read("save triggers");
    //     console.log("save default triggers - complete");
    // }

    // watch.start();
    // const triggerActions = removeUndefined(
    //     await Promise.all(
    //         metadata.map(({ id }) => {
    //             return storage.getItemById(id);
    //         })
    //     )
    // );
    // watch.read("read triggers");

    // watch.start();
    // setTriggerActions(triggerActions);
    // watch.read("setTriggerActions");
});
