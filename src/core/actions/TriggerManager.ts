import { getItemsFromGenericItemSource } from "../source/getItemsFromGenericItemSource";
// import { getSourceEmbed } from "../source/getSourceEmbed";
import { getSourceLocalStorage } from "../source/getSourceLocalStorage";
import { saveItemsToGenericItemSource } from "../source/saveItemsToGenericItemSource";
import {
    getTriggerActionFromJson,
    getTriggerActionJson,
    pruneTriggerActionToTriggerActionMetadata,
} from "./TriggerAction";
import { setTriggerActions } from "./triggerActionHandlers";
import { triggerActionsDefault } from "./triggerActionsDefault";

// Manage the triggers.

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

const storage = getSourceLocalStorage({
    key: "TriggerActions",
    pruneItemToItemMetadata: pruneTriggerActionToTriggerActionMetadata,
    getItemJson: getTriggerActionJson,
    getItemFromJson: getTriggerActionFromJson,
});

/**
 * Load existing triggers and register them
 */
async function initialize() {
    // Retrieve stored trigger actions and then register them.
    let triggerActions = await getItemsFromGenericItemSource(storage);

    // TODO: Temporary for testing.
    if (triggerActions.length === 0) {
        triggerActions = triggerActionsDefault;
        saveItemsToGenericItemSource(storage, triggerActions);
    }

    setTriggerActions(triggerActions);
}

// eslint-disable-next-line  @typescript-eslint/naming-convention
export const TriggerManager = {
    initialize,
};
