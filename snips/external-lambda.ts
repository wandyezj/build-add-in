declare namespace Build {
    function getRandomHtmlColorName(): string;
    const simpleUi: any;
}

declare namespace Excel {
    function run<T>(options: { delayForCellEdit: boolean }, callback: (context: any) => Promise<T>): Promise<T>;
}

declare namespace Word {
    function run<T>(callback: (context: any) => Promise<T>): Promise<T>;
    const InsertLocation: any;
}

declare namespace PowerPoint {
    function run<T>(callback: (context: any) => Promise<T>): Promise<T>;
}

declare namespace Office {
    const context: any;
    function onReady(callback: (options: { host: "Excel" | "Word" | "PowerPoint"; platform: string }) => void): void;
}

/*
Allow Execution of a lambda in a different document context.

Test Case
- Create a table in Excel and then take an image and import that image into Word and PowerPoint.


*/

async function run() {
    globalExternalLambda.clearQueue();

    console.log("run");

    const targetSelf: ExternalLambdaTarget = globalExternalLambda.ownTarget;
    //console.log("targetSelf", targetSelf);

    const targetExcel: ExternalLambdaTarget = {
        host: "Excel",
        documentName: "Demo - Cross App.xlsx",
    };

    const targetWord: ExternalLambdaTarget = {
        host: "Word",
        documentName: "Demo - Cross App.docx",
    };

    const targetPowerPoint: ExternalLambdaTarget = {
        host: "PowerPoint",
        documentName: "Demo - Cross App.pptx",
    };

    const lambdaExcel = async () => {
        return await Excel.run({ delayForCellEdit: true }, async (context) => {
            const color = Build.getRandomHtmlColorName();
            console.log(`Lambda - Excel - Color: ${color}`);

            // Clear
            context.workbook.worksheets.getActiveWorksheet().getUsedRange().clear();

            // Add
            const range = context.workbook.getSelectedRange();

            // add - text
            range.values = [[color]];

            // add - color
            range.format.fill.color = color;

            await context.sync();
            return color;
        });
    };

    const lambdaWord = async () => {
        return await Word.run(async (context) => {
            const color = Build.getRandomHtmlColorName();
            console.log(`Lambda - Word - Color: ${color}`);

            const body = context.document.body;

            // Clear
            body.clear();

            // Add

            // add - text
            const paragraph = body.insertParagraph(`Hello From Excel! ${color}`, Word.InsertLocation.start);

            // add - color
            paragraph.font.color = color;

            await context.sync();
            return color;
        });
    };

    const lambdaPowerPoint = async () => {
        return PowerPoint.run(async (context) => {
            const color = Build.getRandomHtmlColorName();
            console.log(`Lambda - PowerPoint - Color: ${color}`);

            const slide = context.presentation.slides.getItemAt(0);

            // Clear
            const shapes = slide.shapes;
            shapes.load("items");
            await context.sync();
            shapes.items.forEach((shape: any) => shape.delete());

            // Add

            // add - text
            const shape = slide.shapes.addTextBox(`Hello from Excel! ${color}`, {
                left: 100,
                top: 150,
                width: 300,
                height: 100,
            });

            // add - color
            shape.textFrame.textRange.font.color = color;

            await context.sync();
            return color;
        });
    };

    const runTargetLambdas: [string, ExternalLambdaTarget, () => unknown][] = [
        ["self excel", targetSelf, lambdaExcel],
        ["other excel", targetExcel, lambdaExcel],
        ["other word", targetWord, lambdaWord],
        ["other powerpoint", targetPowerPoint, lambdaPowerPoint],
    ];

    for (let i = 0; i < runTargetLambdas.length; i++) {
        const [id, target, lambda] = runTargetLambdas[i];
        console.log(`Execute External Lambda [${i}] ${id}`);

        (async () => {
            const result = await ExecuteExternalLambda(target, lambda).catch((e) => {
                console.error("Lambda Error", e);
                return e;
            });

            console.log(`Execute External Lambda [${i}] ${id}`, "result:", result);
        })();
    }
}

//
// Helpers
//

// function logType(itemName: string, item: unknown) {
//     console.log(itemName, typeof item, `isArray: ${Array.isArray(item)}`, item);
// }

function logTrace(trace: string, ...items: unknown[]) {
    return;
    //console.log(trace, ...items);
}

function logTraceMethod(className: string, methodName: string, trace: string, ...items: unknown[]) {
    return;
    //console.log(className, methodName, trace, ...items);
}

class GlobalLogCounter {
    static #instance: GlobalLogCounter | undefined;
    #names: Map<string, number> = new Map();

    private constructor() {}

    next(name: string) {
        const current = this.#names.get(name) ?? 0;
        this.#names.set(name, current + 1);
        return current;
    }

    static instance() {
        if (!GlobalLogCounter.#instance) {
            GlobalLogCounter.#instance = new GlobalLogCounter();
        }
        return GlobalLogCounter.#instance;
    }
}

type GlobalStorageKeyChange = (options: { oldValue: string | undefined; newValue: string | undefined }) => void;
type GlobalStorageKeyUpdate = (current: string | undefined) => Promise<string>;

class GlobalStorageKey {
    #key: string = "";
    #lockName: string;
    #onChange: GlobalStorageKeyChange | undefined;

    constructor(key: string, onChange?: GlobalStorageKeyChange) {
        this.#key = key;
        this.#lockName = `localstorage-${key}`;
        this.#onChange = onChange;
        window.addEventListener("storage", (event: StorageEvent) => {
            if (event.key === key) {
                const newValue = event.newValue ?? undefined;
                const oldValue = event.oldValue ?? undefined;
                this.#onChange?.({ newValue, oldValue });
            }
        });
    }

    set onChange(onChange: GlobalStorageKeyChange | undefined) {
        this.#onChange = onChange;
    }

    read() {
        const value = localStorage.getItem(this.#key) ?? undefined;
        return value;
    }

    write(value: string): void {
        localStorage.setItem(this.#key, value);
    }

    /**
     * Update with a navigator lock
     */
    async update(doUpdate: GlobalStorageKeyUpdate): Promise<void> {
        const requestId = GlobalLogCounter.instance().next(this.#lockName);
        logTrace(this.constructor.name, `#update - lock - ${requestId} - request`);
        await navigator.locks.request(this.#lockName, async () => {
            logTrace(this.constructor.name, `#update - lock - ${requestId} - acquire`);
            const current = this.read();
            const update = await doUpdate(current);
            this.write(update);
        });
        logTrace(this.constructor.name, `#update - lock - ${requestId} - release`);
    }
}

/**
 * How a target host is identified for the lambda to execute on.
 */
interface ExternalLambdaTarget {
    host: "Word" | "Excel" | "PowerPoint";
    documentName: string;
}

function matchExternalLambdaTarget(a: ExternalLambdaTarget, b: ExternalLambdaTarget): boolean {
    const match = a.host === b.host && a.documentName === b.documentName;
    return match;
}

type ExternalLambdaItem<ExternalLambdaTarget> =
    | ExternalLambdaItemCall<ExternalLambdaTarget>
    | ExternalLambdaItemCallResult;
type ExternalLambdaItemQueue<ExternalLambdaTarget> = ExternalLambdaItem<ExternalLambdaTarget>[];

type MatchExternalLambdaTarget<ExternalLambdaTarget> = (a: ExternalLambdaTarget, b: ExternalLambdaTarget) => boolean;

enum ExternalLambdaItemName {
    Call = "Call",
    CallResult = "CallResult",
}

interface ExternalLambdaItemCall<ExternalLambdaTarget> {
    name: ExternalLambdaItemName.Call;
    id: string;
    parameters: {
        target: ExternalLambdaTarget;
        lambda: string;
        resultId: string;
    };
}

interface ExternalLambdaItemCallResult {
    name: ExternalLambdaItemName.CallResult;
    id: string;
    result: {
        resultId: string;
        type: "resolve" | "reject";
        value: unknown;
    };
}

function getNewQueueItems<ExternalLambdaTarget>(newValue: string, oldValue: string) {
    const itemsNew = JSON.parse(newValue) as ExternalLambdaItemQueue<ExternalLambdaTarget>;
    const itemsOld = JSON.parse(oldValue) as ExternalLambdaItemQueue<ExternalLambdaTarget>;

    // diff base on id
    const extractId = (o: ExternalLambdaItem<ExternalLambdaTarget>) => o.id;

    const idsNew = itemsNew.map(extractId);
    const idsOld = itemsOld.map(extractId);
    const newIds = idsNew.filter((id) => !idsOld.includes(id));

    // All Items
    const newItems = itemsNew.filter(({ id }) => newIds.includes(id));
    return newItems;
}

function getQueueItemsForTarget<ExternalLambdaTarget>(
    queue: ExternalLambdaItemQueue<ExternalLambdaTarget>,
    matchExternalLambdaTarget: MatchExternalLambdaTarget<ExternalLambdaTarget>,
    target: ExternalLambdaTarget,
    resultIds: string[]
): ExternalLambdaItemQueue<ExternalLambdaTarget> {
    return queue.filter((value) => {
        return (
            (value.name === ExternalLambdaItemName.Call &&
                matchExternalLambdaTarget(target, value.parameters.target)) ||
            (value.name === ExternalLambdaItemName.CallResult && resultIds.includes(value.result.resultId))
        );
    });
}

class PromiseMap {
    // resultId -> resolve and reject functions.
    #promiseMap: Map<string, { resolve: (value: unknown) => void; reject: (value: unknown) => void }> = new Map();

    get ids(): string[] {
        return Array.from(this.#promiseMap.keys());
    }

    create(id: string): Promise<unknown> {
        const { promise, resolve, reject } = Promise.withResolvers();
        this.#promiseMap.set(id, { resolve, reject });
        return promise;
    }

    resolve(id: string, value: unknown): void {
        const entry = this.#promiseMap.get(id);
        if (entry) {
            entry.resolve(value);
            this.#promiseMap.delete(id);
        }
    }

    reject(id: string, value: unknown): void {
        const entry = this.#promiseMap.get(id);
        if (entry) {
            entry.reject(value);
            this.#promiseMap.delete(id);
        }
    }
}

class GlobalExternalLambdaQueue<ExternalLambdaTarget> {
    #storage: GlobalStorageKey = new GlobalStorageKey("ExternalLambda");
    #pendingResults = new PromiseMap();

    #matchExternalLambdaTarget: MatchExternalLambdaTarget<ExternalLambdaTarget>;
    #ownTarget: ExternalLambdaTarget;

    #onStorageUpdate: GlobalStorageKeyChange;

    get ownTarget(): ExternalLambdaTarget {
        return this.#ownTarget;
    }

    /**
     * Look through all items in the queue.
     */
    async check() {
        const oldValue = "[]";
        const newValue = this.#storage.read() ?? "[]";
        await this.#onStorageUpdate({ newValue, oldValue });
    }

    clear() {
        this.#storage.write("[]");
    }

    constructor(
        target: ExternalLambdaTarget,
        matchExternalLambdaTarget: MatchExternalLambdaTarget<ExternalLambdaTarget>,
        handleCall: (lambda: string, resolve: (value: unknown) => void, reject: (value: unknown) => void) => void
    ) {
        this.#ownTarget = target;
        this.#matchExternalLambdaTarget = matchExternalLambdaTarget;

        this.#onStorageUpdate = async ({ newValue, oldValue }) => {
            const newItems = getNewQueueItems<ExternalLambdaTarget>(newValue ?? "[]", oldValue ?? "[]");
            const newItemsRelevant = getQueueItemsForTarget<ExternalLambdaTarget>(
                newItems,
                this.#matchExternalLambdaTarget,
                this.#ownTarget,
                this.#pendingResults.ids
            );

            // Remove all items from queue that were read.
            const removeIds = newItemsRelevant.map((item) => item.id);
            await this.#removeItems(removeIds);

            for (const item of newItemsRelevant) {
                switch (item.name) {
                    case ExternalLambdaItemName.Call:
                        // Make the call
                        handleCall(
                            item.parameters.lambda,
                            (value: unknown) => {
                                this.#addResult(item.parameters.resultId, "resolve", value);
                            },
                            (value: unknown) => {
                                this.#addResult(item.parameters.resultId, "reject", value);
                            }
                        );
                        break;
                    case ExternalLambdaItemName.CallResult:
                        // Resolve own Result
                        switch (item.result.type) {
                            case "resolve":
                                this.#pendingResults.resolve(item.result.resultId, item.result.value);
                                break;
                            case "reject":
                                this.#pendingResults.reject(item.result.resultId, item.result.value);
                                break;
                        }
                        break;
                }
            }
        };

        this.#storage.onChange = this.#onStorageUpdate.bind(this);
    }

    /**
     * Current Queue (readonly)
     */
    current(): ExternalLambdaItemQueue<ExternalLambdaTarget> {
        return JSON.parse(this.#storage.read() || "[]");
    }

    async #updateQueue(
        update: (
            currentQueue: ExternalLambdaItemQueue<ExternalLambdaTarget>
        ) => ExternalLambdaItemQueue<ExternalLambdaTarget>
    ): Promise<void> {
        logTrace(this.constructor.name, "#updateQueue");
        await this.#storage.update(async (dataOld) => {
            logTrace(this.constructor.name, "#updateQueue - update");
            // Read
            const queue = JSON.parse(dataOld || "[]") as ExternalLambdaItemQueue<ExternalLambdaTarget>;

            // Update
            const queueNew = update(queue);

            // Write
            const dataNew = JSON.stringify(queueNew);
            return dataNew;
        });
    }

    async #removeItem(id: string): Promise<void> {
        await this.#updateQueue((queue) => {
            // Update - filter out all items with id
            const update = queue.filter((item) => !(item.id === id));
            return update;
        });
    }

    async #removeItems(ids: string[]): Promise<void> {
        await this.#updateQueue((queue) => {
            // Update - filter out all items that have an id in ids
            logTrace(this.constructor.name, "updateQueue - removeItems");
            const update = queue.filter((item) => !ids.includes(item.id));
            return update;
        });
    }

    async #addItem(item: ExternalLambdaItem<ExternalLambdaTarget>): Promise<void> {
        logTrace(this.constructor.name, "#addItem");
        await this.#updateQueue((queue) => {
            logTrace(this.constructor.name, "updateQueue - #addItem");
            // Update - add item to end of queue
            queue.push(item);
            return queue;
        });
    }

    #getId(prefix: string = ""): string {
        return `${prefix}${prefix ? "-" : ""}${crypto.randomUUID()}`;
    }

    async #addCall(resultId: string, target: ExternalLambdaTarget, lambda: string): Promise<void> {
        logTrace(this.constructor.name, "#addCall");
        const item: ExternalLambdaItemCall<ExternalLambdaTarget> = {
            name: ExternalLambdaItemName.Call,
            id: this.#getId(),
            parameters: {
                target,
                lambda,
                resultId,
            },
        };
        await this.#addItem(item);

        // Special handling for calls targeting the current global external lambda's own target.
        // The queue only alerts for diffs from different hosts.
        // If that target is self - force check the queue after the call has been written.
        if (this.#matchExternalLambdaTarget(target, this.#ownTarget)) {
            this.check();
        }
    }

    async #addResult(resultId: string, type: "resolve" | "reject", value: unknown): Promise<void> {
        const item: ExternalLambdaItemCallResult = {
            name: ExternalLambdaItemName.CallResult,
            id: this.#getId(),
            result: {
                resultId,
                type,
                value,
            },
        };
        await this.#addItem(item);

        // Special handling for calls targeting the current global external lambda's own target.
        // The queue only alerts for diffs from different hosts.
        // If that target is self - force check the queue after the result has been written.
        if (this.#pendingResults.ids.includes(resultId)) {
            this.check();
        }
    }

    async makeCall(target: ExternalLambdaTarget, lambda: string): Promise<unknown> {
        logTrace(this.constructor.name, "makeCall");
        const resultId = this.#getId("result");
        const promise = this.#pendingResults.create(resultId);
        await this.#addCall(resultId, target, lambda);
        return promise;
    }
}

class GlobalExternalLambda<ExternalLambdaTarget> {
    #queue: GlobalExternalLambdaQueue<ExternalLambdaTarget>;

    constructor(
        target: ExternalLambdaTarget,
        matchExternalLambdaTarget: MatchExternalLambdaTarget<ExternalLambdaTarget>
    ) {
        this.#queue = new GlobalExternalLambdaQueue<ExternalLambdaTarget>(
            target,
            matchExternalLambdaTarget,
            (lambda, resolve, reject) => {
                this.#evalLambda(lambda, resolve, reject);
            }
        );
    }

    get ownTarget() {
        return this.#queue.ownTarget;
    }

    currentQueue() {
        return this.#queue.current();
    }

    checkQueue() {
        this.#queue.check();
    }

    clearQueue() {
        this.#queue.clear();
    }

    async executeLambda(target: ExternalLambdaTarget, lambda: () => unknown): Promise<unknown> {
        const lambdaString = lambda.toString();
        logTrace(this.constructor.name, "executeLambda", lambdaString);
        return this.#queue.makeCall(target, lambdaString);
    }

    async #evalLambda(f: string, resolve: (value: unknown) => void, reject: (value: unknown) => void) {
        try {
            const lambda = eval(f);
            logTraceMethod(this.constructor.name, "#evalLambda", "call", "start");
            const result = await lambda();
            logTraceMethod(this.constructor.name, "#evalLambda", "call", "resolve", result);
            resolve(result);
        } catch (e) {
            logTraceMethod(this.constructor.name, "#evalLambda", "call", "reject", e);
            reject(e);
        }
    }
}

let globalExternalLambda: GlobalExternalLambda<ExternalLambdaTarget>;

function getOfficeDocumentName(): string {
    const url = Office.context.document.url;

    if (!url) {
        return "UnsavedDocument" + Crypto.randomUUID();
    }

    try {
        const name = decodeURIComponent(url).split("/").pop().split("\\").pop();
        return name;
    } catch (e) {
        console.error("Failed to get document name from URL:", e);
        return "UnsavedDocument" + Crypto.randomUUID();
    }
}

function getTargetInfoExcel(): ExternalLambdaTarget {
    const documentName = getOfficeDocumentName();

    return {
        host: "Excel",
        documentName,
    };
}

function getTargetInfoWord(): ExternalLambdaTarget {
    const documentName = getOfficeDocumentName();

    return {
        host: "Word",
        documentName,
    };
}

function getTargetInfoPowerPoint(): ExternalLambdaTarget {
    const documentName = getOfficeDocumentName();

    return {
        host: "PowerPoint",
        documentName,
    };
}

function getTargetInfoForHost(host: ExternalLambdaTarget["host"]) {
    switch (host) {
        case "Word":
            return getTargetInfoWord();
        case "PowerPoint":
            return getTargetInfoPowerPoint();
        case "Excel":
            return getTargetInfoExcel();
    }
}

async function setGlobalExternalLambda(host: ExternalLambdaTarget["host"]) {
    const targetInfo = getTargetInfoForHost(host);
    console.log(targetInfo);

    globalExternalLambda = new GlobalExternalLambda<ExternalLambdaTarget>(targetInfo, matchExternalLambdaTarget);
}

/**
 * Execute a lambda in the context of
 */
async function ExecuteExternalLambda<T>(target: ExternalLambdaTarget, lambda: () => T): Promise<T> {
    const promise = globalExternalLambda.executeLambda(target, lambda);
    return promise as Promise<T>;
}

//
// UI
//

const id = {
    div: {
        dynamic: "div-dynamic",
    },
    textarea: {
        storageCurrent: "textarea-storage-current",
        storageWrite: "textarea-storage-write",
        storageRead: "textarea-storage-read",
    },
} as const;

function setTextArea(id: string, data: string) {
    const element = document.getElementById(id) as HTMLTextAreaElement;
    element.value = data;
}

function getTextArea(id: string): string {
    const element = document.getElementById(id) as HTMLTextAreaElement;
    return element.value;
}

const storage = new GlobalStorageKey("share", ({ newValue }) => {
    setTextArea(id.textarea.storageCurrent, newValue || "");
});

function buttonStorageRead() {
    console.log("Button - Storage Read");
    const data = storage.read() || "";
    //console.log(data);
    setTextArea(id.textarea.storageRead, data);
}

function buttonStorageWrite() {
    console.log("Button - Storage Write");

    const data = getTextArea(id.textarea.storageWrite);
    //console.log(data)
    storage.write(data);
}

async function setup() {
    Build.SimpleUi.create()
        .button({
            text: "Run",
            onclick: () => {
                run();
            },
        })
        .p({ text: globalExternalLambda.host })
        .p({ text: globalExternalLambda.documentName })
        .br()
        .button({
            text: "Read Queue",
            onclick: () => {
                console.log(globalExternalLambda.currentQueue());
            },
        })
        .button({
            text: "Check Queue",
            onclick: () => {
                console.log(globalExternalLambda.checkQueue());
            },
        })
        .button({
            text: "Clear Queue",
            onclick: () => {
                globalExternalLambda.clearQueue();
            },
        })
        .br()
        .p({ text: "Shared Storage" })
        .textarea({ id: id.textarea.storageCurrent, rows: 1, cols: 30 })
        .br()
        .textarea({ id: id.textarea.storageRead, rows: 1, cols: 30 })
        .button({ text: "Storage Read", onclick: buttonStorageRead })
        .br()
        .textarea({ id: id.textarea.storageWrite, rows: 1, cols: 30 })
        .button({ text: "Storage Write", onclick: buttonStorageWrite })
        .buildOnDiv(id.div.dynamic);

    setTextArea(id.textarea.storageRead, storage.read() || "");
}

Office.onReady(async ({ host, platform }) => {
    console.log("READY");

    const elementHost = document.getElementById("host");
    elementHost.innerText = `${host}`;

    const elementPlatform = document.getElementById("platform");
    elementPlatform.innerText = `${platform}`;

    await setGlobalExternalLambda(host);

    setup();
});
