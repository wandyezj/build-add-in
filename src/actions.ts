import { ActionType, TriggerAction, TriggerType } from "./core/actions/TriggerAction";
import { registerTriggerActionsInitial, setTriggerActions } from "./core/actions/triggerActionHandlers";
import { getSourceEmbed } from "./core/embed/getSourceEmbed";
import { setHost } from "./core/globals";

console.log("actions load");

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
        type: ActionType.LogId,
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

// Store triggers in custom XML

type TriggerActionMetadata = Pick<TriggerAction, "id">;

function pruneTriggerActionToTriggerActionMetadata(triggerAction: TriggerAction): TriggerActionMetadata {
    const { id } = triggerAction;
    return {
        id,
    };
}

function getTriggerActionJson(triggerAction: TriggerAction): string {
    // TODO: prune if needed before storage
    const s = JSON.stringify(triggerAction, undefined, 4);
    return s;
}

function getTriggerActionFromJson(json: string): TriggerAction {
    // TODO: validate the thing read
    const triggerAction = JSON.parse(json) as TriggerAction;
    return triggerAction;
}

const embedNamespace = "build-add-in-trigger-action";
const embedTag = "TriggerAction";

const storage = getSourceEmbed({
    embedNamespace,
    embedTag,
    pruneItemToItemMetadata: pruneTriggerActionToTriggerActionMetadata,
    getItemJson: getTriggerActionJson,
    getItemFromJson: getTriggerActionFromJson,
});

function removeUndefined<T>(array: (T | undefined)[]): T[] {
    return array.filter((x) => x !== undefined) as T[];
}

// import { embedDeleteById, embedReadAllId } from "./core/embed/embed";
// async function removeAllEmbedTriggers() {
//     const ids = await embedReadAllId({ embedNamespace });
//     await Promise.all(ids.map((id) => embedDeleteById({ id, embedNamespace })));
// }

class StopWatch {
    constructor(private name: string) {}
    lastStart = 0;
    start() {
        this.lastStart = Date.now();
    }

    read(header: string = "") {
        const current = Date.now();
        const delta = current - this.lastStart;
        const milliseconds = delta;
        console.log(`[${this.name}] ${header} = ${milliseconds} ms`);
    }
}

function getWatch(name: string) {
    return new StopWatch(name);
}

Office.onReady(async ({ host }) => {
    console.log("ready");
    setHost(host);

    const watch = getWatch("boot");
    watch.start();

    // read triggers
    let metadata = await storage.getAllItemMetadata();
    watch.read("read trigger metadata");

    if (metadata.length === 0) {
        console.log("save default triggers - start");
        // embed some triggers
        watch.start();
        await Promise.all(triggerActionsDefault.map((item) => storage.saveItem(item)));
        metadata = await storage.getAllItemMetadata();
        watch.read("save triggers");
        console.log("save default triggers - complete");
    }

    watch.start();
    const triggerActions = removeUndefined(
        await Promise.all(
            metadata.map(({ id }) => {
                return storage.getItemById(id);
            })
        )
    );
    watch.read("read triggers");

    watch.start();
    setTriggerActions(triggerActions);
    watch.read("setTriggerActions");
    registerTriggerActionsInitial();
});
