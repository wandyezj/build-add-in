import { ActionType, TriggerAction, TriggerType } from "./core/actions/TriggerAction";

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

const triggerActions: TriggerAction[] = [triggerActionLoadLog, triggerActionExcelNamedRangeTest];

async function registerTriggerActions() {
    console.log("Register Triggers");

    // Trigger on an edit to a named range.

    // target range
    const namedRange = "test";

    // Register an event that triggers when a worksheet is changed from a user local edit.
    await Excel.run(async (context) => {
        const workbook = context.workbook;
        const worksheets = workbook.worksheets;

        worksheets.onChanged.add(async (event) => {
            // Filter for local range edits not made by the Add-In
            if (
                event.source === Excel.EventSource.local &&
                event.triggerSource !== Excel.EventTriggerSource.thisLocalAddin &&
                event.changeType === Excel.DataChangeType.rangeEdited
            ) {
                console.log("Trigger");

                const eventWorksheetId = event.worksheetId;
                const eventAddress = event.address;

                console.log(eventWorksheetId);
                console.log(eventAddress);
                // details only useful for single cell edits
                console.log(event.details);

                // will need to check for intersection with target range address
                const intersect = await Excel.run(async (context) => {
                    const workbook = context.workbook;
                    const worksheets = workbook.worksheets;
                    const sheet = worksheets.getActiveWorksheet();
                    sheet.load("id");
                    const namedItem = sheet.names.getItem(namedRange);
                    const range = namedItem.getRangeOrNullObject();

                    const intersection = range.getIntersectionOrNullObject(eventAddress);
                    await context.sync();

                    const intersects = !intersection.isNullObject && sheet.id === eventWorksheetId;
                    return intersects;
                });

                console.log(`Intersects ${intersect ? "true" : "FALSE"}`);
            }
        });
    });
}

Office.onReady(() => {
    console.log("ready");
    // Requires trigger of the runtime before it will automatically start up.
    Office.addin.setStartupBehavior(Office.StartupBehavior.load);
    registerTriggerActions();
});
