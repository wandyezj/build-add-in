import {
    Action,
    ActionType,
    TriggerAction,
    TriggerExcelNamedRangeEdit,
    TriggerType,
} from "./core/actions/TriggerAction";

// cspell:ignore SHOWTASKPANE HIDETASKPANE addin
console.log("actions load");

Office.actions.associate("SHOWTASKPANE", function () {
    console.log("shortcut - Show");
    return Office.addin
        .showAsTaskpane()
        .then(function () {
            return;
        })
        .catch(function (error) {
            return error.code;
        });
});

Office.actions.associate("HIDETASKPANE", async function () {
    console.log("shortcut - Hide");
    try {
        await Office.addin.hide();
    } catch (e) {
        console.log(e);
    }
});

Office.actions.associate("SETCOLOR", function () {
    console.log("shortcut - Set Color");
    Excel.run(async (context) => {
        const range = context.workbook.getSelectedRange();
        range.format.fill.load("color");

        await context.sync();
        const colors = ["#FFFFFF", "#C7CC7A", "#7560BA", "#9DD9D2", "#FFE1A8", "#E26D5C"];
        const colorIndex = (colors.indexOf(range.format.fill.color) + 1) % colors.length;
        range.format.fill.color = colors[colorIndex];
        await context.sync();
    });
});

const triggerActionLoadLog: TriggerAction = {
    id: "LoadLog",
    trigger: {
        type: TriggerType.Load,
    },
    action: {
        type: ActionType.LogId,
    },
};

const triggerActionExcelNamedRangeTest: TriggerAction = {
    id: "NamedRangeTest",
    trigger: {
        type: TriggerType.ExcelNamedRangeEdit,
        parameters: {
            namedRangeName: "test",
        },
    },
    action: {
        type: ActionType.LogId,
    },
};

/**
 * action registry
 */
const triggerActions: TriggerAction[] = [triggerActionLoadLog, triggerActionExcelNamedRangeTest];

function runActionLogId(triggerAction: TriggerAction) {
    const { id } = triggerAction;
    console.log(`Trigger: [${id}]`);
}

/**
 * Actions types to runs.
 */
const actionMap = new Map<string, (triggerAction: TriggerAction) => void>([[ActionType.LogId, runActionLogId]]);

function runAction(triggerAction: TriggerAction) {
    const actionType = triggerAction.action.type;
    const handler = actionMap.get(actionType);

    if (handler === undefined) {
        console.log(`Handler for actionType ${actionType}`);
    } else {
        handler(triggerAction);
    }
}

function getTriggerTypes(triggerActions: TriggerAction[], triggerType: TriggerType) {
    const triggers = triggerActions.filter((triggerAction) => triggerAction.trigger.type === triggerType);
    return triggers;
}

function hasTriggerType(triggerActions: TriggerAction[], triggerType: TriggerType) {
    const triggers = getTriggerTypes(triggerActions, triggerType);
    return triggers.length > 0;
}

function runTriggersActions(triggers: TriggerAction[]) {
    triggers.forEach((trigger) => {
        runAction(trigger);
    });
}

/**
 * Trigger all load triggers
 */
function triggerLoad() {
    const triggers = getTriggerTypes(triggerActions, TriggerType.Load);
    runTriggersActions(triggers);
}

/**
 * Trigger all Excel Named Range Edit triggers relevant to the event.
 * @param event
 */
async function triggerExcelNamedRangeEdit(event: { worksheetId: string; rangeAddress: string }) {
    const triggers = getTriggerTypes(triggerActions, TriggerType.ExcelNamedRangeEdit) as {
        id: string;
        trigger: TriggerExcelNamedRangeEdit;
        action: Action;
    }[];

    // Check if the Range edit action matches a trigger
    const matching = await Excel.run(async (context) => {
        const workbook = context.workbook;

        const intersects = triggers.map((trigger, index) => {
            const namedItemName = trigger.trigger.parameters.namedRangeName;
            const namedItem = workbook.names.getItemOrNullObject(namedItemName);
            const range = namedItem.getRangeOrNullObject();

            const eventRange = workbook.worksheets.getItemOrNullObject(event.worksheetId).getRange(event.rangeAddress);
            const intersection = range.getIntersectionOrNullObject(eventRange);
            return { intersection, index };
        });

        await context.sync();

        const match = intersects
            .filter(({ intersection }) => !intersection.isNullObject)
            .map(({ index }) => triggers[index]);
        return match;
    });

    runTriggersActions(matching);
}

async function handleWorksheetsChanged(event: Excel.WorksheetChangedEventArgs) {
    // Filter for local range edits not made by the Add-In
    if (
        event.source === Excel.EventSource.local &&
        event.triggerSource !== Excel.EventTriggerSource.thisLocalAddin &&
        event.changeType === Excel.DataChangeType.rangeEdited
    ) {
        console.log("Trigger");

        const eventWorksheetId = event.worksheetId;
        const eventAddress = event.address;
        triggerExcelNamedRangeEdit({ worksheetId: eventWorksheetId, rangeAddress: eventAddress });
    }
}

//async function registerTriggerExcelNamedRangeEdit() {}

async function registerTriggerActions() {
    // Trigger on an edit to a named range.

    const hasTriggerExcelNamedRangeEdit = hasTriggerType(triggerActions, TriggerType.ExcelNamedRangeEdit);

    // Register an event that triggers when a worksheet is changed from a user local edit.
    await Excel.run(async (context) => {
        const workbook = context.workbook;
        const worksheets = workbook.worksheets;

        if (hasTriggerExcelNamedRangeEdit) {
            worksheets.onChanged.add(handleWorksheetsChanged);
        }
    });
}

// target range
// const namedRange = "test";

// console.log(eventWorksheetId);
// console.log(eventAddress);
// // details only useful for single cell edits
// console.log(event.details);

// // will need to check for intersection with target range address
// const intersect = await Excel.run(async (context) => {
//     const workbook = context.workbook;
//     const worksheets = workbook.worksheets;
//     const sheet = worksheets.getActiveWorksheet();
//     sheet.load("id");
//     const namedItem = sheet.names.getItem(namedRange);
//     const range = namedItem.getRangeOrNullObject();

//     const intersection = range.getIntersectionOrNullObject(eventAddress);
//     await context.sync();

//     const intersects = !intersection.isNullObject && sheet.id === eventWorksheetId;
//     return intersects;
// });

// console.log(`Intersects ${intersect ? "true" : "FALSE"}`);

Office.onReady(() => {
    console.log("ready");
    // Requires trigger of the runtime before it will automatically start up.
    Office.addin.setStartupBehavior(Office.StartupBehavior.load);

    triggerLoad();

    registerTriggerActions();
});
