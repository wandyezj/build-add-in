import { ActionType, TriggerAction, TriggerType } from "./core/actions/TriggerAction";
import { logTriggerId, registerTriggerActions, setTriggerActions } from "./core/actions/triggerActionHandlers";

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
                    const range = sheet.getRange("B1");
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

Office.onReady(() => {
    console.log("ready");
    // Requires trigger of the runtime before it will automatically start up.
    Office.addin.setStartupBehavior(Office.StartupBehavior.load);

    setTriggerActions(triggerActions);
    registerTriggerActions();
});
