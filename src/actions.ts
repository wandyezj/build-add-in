import { ActionType, TriggerAction, TriggerType } from "./core/actions/TriggerAction";
import { logTriggerId, registerTriggerActions } from "./core/actions/triggerActionHandlers";

console.log("actions load");

const triggerActionLoadLogTest: TriggerAction = {
    id: "LoadLogTest",
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

const triggerActionExcelWorksheetNameRangeAddressTest: TriggerAction = {
    id: "Sheet1A1Edit",
    trigger: {
        type: TriggerType.ExcelWorksheetNameRangeAddressEdit,
        parameters: {
            worksheetName: "Sheet1",
            rangeAddress: "A1",
        },
    },
    action: {
        type: ActionType.Callback,
        parameters: {
            callback: async (triggerAction: Readonly<TriggerAction>) => {
                // Log that this was called.
                logTriggerId(triggerAction);

                await Excel.run(async (context) => {
                    const sheet = context.workbook.worksheets.getItemOrNullObject("Sheet1");
                    const range = sheet.getRange("A2");
                    range.load("values");
                    await context.sync();
                    if (range.isNullObject) {
                        return;
                    }

                    const value = range.values[0][0];
                    let newValue = 0;
                    if (typeof value === "number") {
                        newValue = value + 1;
                    }

                    range.values = [[newValue]];
                    await context.sync();
                    console.log("Incremented Value");
                });
            },
        },
    },
};

/**
 * action registry
 */
export const triggerActions: TriggerAction[] = [
    triggerActionLoadLogTest,
    triggerActionExcelNamedRangeTest,
    triggerActionExcelWorksheetNameRangeAddressTest,
];

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

    registerTriggerActions();
});
