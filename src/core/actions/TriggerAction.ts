export enum TriggerType {
    /**
     * When the shared runtime is loaded
     */
    Load = "Load",
    /**
     * When an excel named range is edited
     */
    ExcelNamedRangeEdit = "ExcelNamedRangeEdit",

    /**
     * When an excel worksheet (by name) range (by address) is edited
     */
    ExcelWorksheetNameRangeAddressEdit = "ExcelWorksheetNameRangeAddressEdit",
}

export interface TriggerLoad {
    type: TriggerType.Load;
}

export interface TriggerExcelNamedRangeEdit {
    type: TriggerType.ExcelNamedRangeEdit;
    parameters: {
        /**
         * global named range
         */
        namedRangeName: string;
    };
}

export interface TriggerExcelWorksheetNameRangeAddressEdit {
    type: TriggerType.ExcelWorksheetNameRangeAddressEdit;
    parameters: {
        /**
         * name of the worksheet.
         */
        worksheetName: string;

        /**
         * address of the range.
         */
        rangeAddress: string;
    };
}

export type Trigger = TriggerLoad | TriggerExcelNamedRangeEdit | TriggerExcelWorksheetNameRangeAddressEdit;

export enum ActionType {
    /**
     * Log the id of the trigger;
     */
    LogId = "LogId",

    /**
     * Run a callback.
     * note: this is an incredibly powerful action and shouldn't be serialized, but ok to use internally.
     */
    Callback = "Callback",

    /**
     * eval the code and execute main function
     * !!!WARNING!!! incredibly not secure only for proof of concept
     */
    EvalCallback = "EvalCallback",
}

export interface ActionLogId {
    type: ActionType.LogId;
}

export interface ActionCallback {
    type: ActionType.Callback;
    parameters: {
        /**
         * Hardcoded callback to call.
         * @param triggerAction the trigger action that triggered the callback.
         * @returns
         */
        callback: (triggerAction: Readonly<TriggerAction>) => Promise<void>;
    };
}

export interface ActionEvalCallback {
    type: ActionType.EvalCallback;
    parameters: {
        /**
         * Hardcoded string callback to call. eval and call main function with TriggerAction/
         * @returns
         */
        callback: string;
    };
}

export type Action = ActionLogId | ActionCallback | ActionEvalCallback;

export interface TriggerAction {
    /**
     * Unique id to easily identify the Trigger Action
     */
    id: string;

    /**
     * Easily readable identifier.
     */
    name: string;

    trigger: Trigger;
    action: Action;
}

// Functions required for storage of TriggerAction

export type TriggerActionMetadata = Pick<TriggerAction, "id">;

export function pruneTriggerActionToTriggerActionMetadata(triggerAction: TriggerAction): TriggerActionMetadata {
    const { id } = triggerAction;
    return {
        id,
    };
}

export function getTriggerActionJson(triggerAction: TriggerAction): string {
    // TODO: prune if needed before storage
    const s = JSON.stringify(triggerAction, undefined, 4);
    return s;
}

export function getTriggerActionFromJson(json: string): TriggerAction {
    // TODO: validate the thing read
    const triggerAction = JSON.parse(json) as TriggerAction;
    return triggerAction;
}
