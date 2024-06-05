export enum TriggerType {
    /**
     * When the shared runtime is loaded
     */
    Load = "Load",
    /**
     * When an excel named range is edited
     */
    ExcelNamedRangeEdit = "ExcelNamedRangeEdit",
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

export type Trigger = TriggerLoad | TriggerExcelNamedRangeEdit;

export enum ActionType {
    /**
     * Log the id of the trigger;
     */
    LogId = "LogId",
}

export interface ActionLogId {
    type: ActionType.LogId;
}

export type Action = ActionLogId;

export interface TriggerAction {
    /**
     * Unique id to easily identify the Trigger Action
     */
    id: string;

    trigger: Trigger;
    action: Action;
}
