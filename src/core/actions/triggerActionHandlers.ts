import {
    Action,
    ActionType,
    TriggerAction,
    TriggerExcelNamedRangeEdit,
    TriggerExcelWorksheetNameRangeAddressEdit,
    TriggerType,
} from "./TriggerAction";

// Trigger registration and Action handling.

export function logTriggerId(triggerAction: TriggerAction) {
    const { id } = triggerAction;
    console.log(`Trigger: [${id}]`);
}

// #region runAction

function runActionLogId(triggerAction: TriggerAction) {
    const { action } = triggerAction;
    if (action.type === ActionType.LogId) {
        logTriggerId(triggerAction);
    }
}
function runActionCallback(triggerAction: TriggerAction) {
    const { action } = triggerAction;
    if (action.type === ActionType.Callback) {
        const { callback } = action.parameters;
        callback(triggerAction);
    }
}

/**
 * Actions types to runs.
 */
const actionMap = new Map<string, (triggerAction: TriggerAction) => void>([
    [ActionType.LogId, runActionLogId],
    [ActionType.Callback, runActionCallback],
]);

function runAction(triggerAction: TriggerAction) {
    const actionType = triggerAction.action.type;
    const handler = actionMap.get(actionType);

    if (handler === undefined) {
        console.log(`Handler for actionType ${actionType}`);
    } else {
        handler(triggerAction);
    }
}

function runTriggersActions(triggers: TriggerAction[]) {
    triggers.forEach((trigger) => {
        runAction(trigger);
    });
}

// #endregion runAction

// #region Trigger

/**
 * Trigger all load triggers
 */
function triggerLoad() {
    const triggers = getTriggerTypes(TriggerType.Load);
    runTriggersActions(triggers);
}
/**
 * Trigger all Excel Named Range Edit triggers relevant to the event.
 * @param event
 */

async function triggerExcelNamedRangeEdit(event: { worksheetId: string; rangeAddress: string }) {
    const triggerActions = getTriggerTypes(TriggerType.ExcelNamedRangeEdit) as {
        id: string;
        trigger: TriggerExcelNamedRangeEdit;
        action: Action;
    }[];

    // Check if the Range edit action matches a trigger
    const matching = await Excel.run(async (context) => {
        const workbook = context.workbook;

        const intersects = triggerActions.map((trigger, index) => {
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
            .map(({ index }) => triggerActions[index]);
        return match;
    });
    //console.log(`matching [triggerExcelNamedRangeEdit] [${matching.length}]`);
    runTriggersActions(matching);
}

/**
 * Trigger all Excel Named Range Edit triggers relevant to the event.
 * @param event
 */
async function triggerExcelWorksheetNameRangeAddressEdit(event: { worksheetId: string; rangeAddress: string }) {
    const triggerActions = getTriggerTypes(TriggerType.ExcelWorksheetNameRangeAddressEdit) as {
        id: string;
        trigger: TriggerExcelWorksheetNameRangeAddressEdit;
        action: Action;
    }[];

    // Check if the Range edit action matches a trigger
    const matching = await Excel.run(async (context) => {
        const workbook = context.workbook;

        const intersects = triggerActions.map((triggerAction, index) => {
            const { worksheetName, rangeAddress } = triggerAction.trigger.parameters;
            const range = workbook.worksheets.getItemOrNullObject(worksheetName).getRange(rangeAddress);

            const eventRange = workbook.worksheets.getItemOrNullObject(event.worksheetId).getRange(event.rangeAddress);
            const intersection = range.getIntersectionOrNullObject(eventRange);
            return { intersection, index };
        });

        await context.sync();

        const match = intersects
            .filter(({ intersection }) => !intersection.isNullObject)
            .map(({ index }) => triggerActions[index]);
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
        triggerExcelWorksheetNameRangeAddressEdit({ worksheetId: eventWorksheetId, rangeAddress: eventAddress });
    }
}

// #endregion Trigger

// #region TriggerRegister

/**
 * All current trigger actions that are ready to execute.
 */
let globalTriggerActions: TriggerAction[] = [];

export function setTriggerActions(triggerActions: TriggerAction[]) {
    globalTriggerActions = triggerActions;
}

function getTriggerTypes(triggerType: TriggerType) {
    const triggers = globalTriggerActions.filter((triggerAction) => triggerAction.trigger.type === triggerType);
    return triggers;
}

function hasTriggerType(triggerType: TriggerType) {
    const triggers = getTriggerTypes(triggerType);
    return triggers.length > 0;
}

export async function registerTriggerActions() {
    triggerLoad();

    // Trigger on an edit to a named range.
    const hasTriggerExcelNamedRangeEdit = hasTriggerType(TriggerType.ExcelNamedRangeEdit);
    const hasTriggerExcelSheetNameRangeAddressEdit = hasTriggerType(TriggerType.ExcelWorksheetNameRangeAddressEdit);

    // Register an event that triggers when a worksheet is changed from a user local edit.
    await Excel.run(async (context) => {
        const workbook = context.workbook;
        const worksheets = workbook.worksheets;

        if (hasTriggerExcelNamedRangeEdit || hasTriggerExcelSheetNameRangeAddressEdit) {
            worksheets.onChanged.add(handleWorksheetsChanged);
        }
    });
}

// #endregion TriggerRegister
