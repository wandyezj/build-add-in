import { ActionType, TriggerAction, TriggerType } from "./TriggerAction";

const triggerActionLoadLogTest: TriggerAction = {
    id: "1",
    name: "LoadLogTest",
    trigger: {
        type: TriggerType.Load,
    },
    action: {
        type: ActionType.LogId,
    },
};
const triggerActionExcelNamedRangeTest: TriggerAction = {
    id: "2",
    name: "NamedRangeTest",
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
    id: "3",
    name: "Sheet1A1Edit",
    trigger: {
        type: TriggerType.ExcelWorksheetNameRangeAddressEdit,
        parameters: {
            worksheetName: "Sheet1",
            rangeAddress: "A1",
        },
    },
    action: {
        type: ActionType.EvalCallback,
        parameters: {
            callback: `
            async function main(triggerAction) {
                console.log(triggerAction.id)
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
            }
            `,
        },
        // type: ActionType.Callback,
        // parameters: {
        //     callback: async (triggerAction: Readonly<TriggerAction>) => {
        //         // Log that this was called.
        //         logTriggerId(triggerAction);
        //         await Excel.run(async (context) => {
        //             const sheet = context.workbook.worksheets.getItemOrNullObject("Sheet1");
        //             const range = sheet.getRange("B1");
        //             range.load("values");
        //             await context.sync();
        //             if (range.isNullObject) {
        //                 return;
        //             }
        //             const value = range.values[0][0];
        //             let newValue = 0;
        //             if (typeof value === "number") {
        //                 newValue = value + 1;
        //             }
        //             range.values = [[newValue]];
        //             await context.sync();
        //             console.log("Incremented Value");
        //         });
        //     },
        // },
    },
};
/**
 * action registry
 */

export const triggerActionsDefault: TriggerAction[] = [
    triggerActionLoadLogTest,
    triggerActionExcelNamedRangeTest,
    triggerActionExcelWorksheetNameRangeAddressTest,
];
