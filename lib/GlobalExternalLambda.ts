import { PromiseMap } from "./PromiseMap";
/**
 * Callback for when a global storage key changes.
 *
 * @beta
 */
export type GlobalStorageKeyChange = (options: { oldValue: string | undefined; newValue: string | undefined }) => void;

/**
 * Callback for updating the value of a global storage key.
 *
 * @beta
 */
export type GlobalStorageKeyUpdate = (current: string | undefined) => Promise<string>;

/**
 * A class representing a global storage key with change notifications and update locks.
 *
 * @beta
 */
export class GlobalStorageKey {
    #key: string = "";
    #lockName: string;
    #onChange: GlobalStorageKeyChange | undefined;

    /**
     * Creates a new instance of the GlobalStorageKey class.
     * @beta
     *
     * @param key The localstorage key name.
     * @param onChange The callback function to be invoked when the value of the global storage key changes.
     */
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

    /**
     * Sets the change callback for the global storage key.
     *
     * @beta
     */
    set onChange(onChange: GlobalStorageKeyChange | undefined) {
        this.#onChange = onChange;
    }

    /**
     * Reads the current value of the global storage key.
     * @beta
     *
     * @returns The current value of the global storage key, or undefined if it does not exist.
     */
    read() {
        const value = localStorage.getItem(this.#key) ?? undefined;
        return value;
    }

    /**
     * Writes a new value to the global storage key.
     * @beta
     *
     * @param value The new value to write to the global storage key.
     */
    write(value: string): void {
        localStorage.setItem(this.#key, value);
    }

    /**
     * Update the value of the global storage key using a navigator lock.
     * @beta
     *
     * @param doUpdate The callback function to update the value of the global storage key.
     * @returns A promise that resolves once the update is complete.
     */
    async update(doUpdate: GlobalStorageKeyUpdate): Promise<void> {
        await navigator.locks.request(this.#lockName, async () => {
            const current = this.read();
            const update = await doUpdate(current);
            this.write(update);
        });
    }
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
        lambdaArguments: unknown[];
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

class GlobalExternalLambdaQueue<ExternalLambdaTarget> {
    #storage: GlobalStorageKey;
    #pendingResults = new PromiseMap();

    #matchExternalLambdaTarget: MatchExternalLambdaTarget<ExternalLambdaTarget>;
    #ownTarget: ExternalLambdaTarget;

    #onStorageUpdate: GlobalStorageKeyChange;

    constructor(
        key: string,
        target: ExternalLambdaTarget,
        matchExternalLambdaTarget: MatchExternalLambdaTarget<ExternalLambdaTarget>,
        handleCall: (
            lambda: string,
            lambdaArguments: unknown[],
            resolve: (value: unknown) => void,
            reject: (value: unknown) => void
        ) => void
    ) {
        this.#storage = new GlobalStorageKey(key);
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
                            item.parameters.lambdaArguments,
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
        await this.#storage.update(async (dataOld) => {
            // Read
            const queue = JSON.parse(dataOld || "[]") as ExternalLambdaItemQueue<ExternalLambdaTarget>;

            // Update
            const queueNew = update(queue);

            // Write
            const dataNew = JSON.stringify(queueNew);
            return dataNew;
        });
    }

    async #removeItems(ids: string[]): Promise<void> {
        await this.#updateQueue((queue) => {
            // Update - filter out all items that have an id in ids
            const update = queue.filter((item) => !ids.includes(item.id));
            return update;
        });
    }

    async #addItem(item: ExternalLambdaItem<ExternalLambdaTarget>): Promise<void> {
        await this.#updateQueue((queue) => {
            // Update - add item to end of queue
            queue.push(item);
            return queue;
        });
    }

    #getId(prefix: string = ""): string {
        return `${prefix}${prefix ? "-" : ""}${crypto.randomUUID()}`;
    }

    async #addCall(
        resultId: string,
        target: ExternalLambdaTarget,
        lambda: string,
        lambdaArguments: unknown[]
    ): Promise<void> {
        const item: ExternalLambdaItemCall<ExternalLambdaTarget> = {
            name: ExternalLambdaItemName.Call,
            id: this.#getId(),
            parameters: {
                target,
                lambda,
                lambdaArguments,
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

    async makeCall(target: ExternalLambdaTarget, lambda: string, lambdaArguments: unknown[]): Promise<unknown> {
        const resultId = this.#getId("result");
        const promise = this.#pendingResults.create(resultId);
        await this.#addCall(resultId, target, lambda, lambdaArguments);
        return promise;
    }
}

/**
 * Interface representing an instance of a global external lambda.
 * @public
 */
export interface ExternalLambdaInstance<ExternalLambdaTarget> {
    /**
     *
     * @param target - Which instance should execute this lambda.
     * @param lambda - The lambda to send. note: the lambda is serialized and may not reference any thing outside it's scope.
     * @param lambdaArguments - The arguments to pass to the lambda function.
     */
    executeLambda<LambdaArguments extends unknown[], LambdaReturn>(
        target: ExternalLambdaTarget,
        lambda: (...args: LambdaArguments) => LambdaReturn,
        ...lambdaArguments: LambdaArguments
    ): Promise<LambdaReturn>;

    /**
     * Get the targeting information for the current external lambda instance.
     * @public
     */
    ownTarget: ExternalLambdaTarget;

    /**
     * Get the current queue of external lambda items.
     * @public
     */
    currentQueue(): ExternalLambdaItem<ExternalLambdaTarget>[];

    /**
     * Force check the current queue of external lambda items.
     * @public
     */
    checkQueue(): void;

    /**
     * Clear the current queue of external lambda items.
     * @public
     */
    clearQueue(): void;
}

class GlobalExternalLambda<ExternalLambdaTarget> implements ExternalLambdaInstance<ExternalLambdaTarget> {
    #queue: GlobalExternalLambdaQueue<ExternalLambdaTarget>;

    constructor(
        key: string,
        target: ExternalLambdaTarget,
        matchExternalLambdaTarget: MatchExternalLambdaTarget<ExternalLambdaTarget>
    ) {
        this.#queue = new GlobalExternalLambdaQueue<ExternalLambdaTarget>(
            key,
            target,
            matchExternalLambdaTarget,
            (lambda, lambdaArguments, resolve, reject) => {
                this.#evalLambda(lambda, lambdaArguments, resolve, reject);
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

    async executeLambda<LambdaArguments extends unknown[], LambdaReturn>(
        target: ExternalLambdaTarget,
        lambda: (...args: LambdaArguments) => LambdaReturn,
        ...lambdaArguments: LambdaArguments
    ): Promise<LambdaReturn> {
        const lambdaString = lambda.toString();
        return this.#queue.makeCall(target, lambdaString, lambdaArguments) as Promise<LambdaReturn>;
    }

    async #evalLambda(
        f: string,
        lambdaArguments: unknown[],
        resolve: (value: unknown) => void,
        reject: (value: unknown) => void
    ) {
        try {
            const lambda = eval(f);
            const result = await lambda(...lambdaArguments);
            resolve(result);
        } catch (e) {
            reject(e);
        }
    }
}

/**
 * Construct an external lambda pipe.
 * This should be called once.
 * @public
 * @param key LocalStorage key to use for the external lambda pipe.
 * @param target The targeting information for the current pipe.
 * @param matchExternalLambdaTarget The function used to match external lambda targets for the current pipe.
 * @returns An instance of the external lambda pipe.
 */
export function initializeExternalLambda<ExternalLambdaTarget>(
    key: string,
    target: ExternalLambdaTarget,
    matchExternalLambdaTarget: MatchExternalLambdaTarget<ExternalLambdaTarget>
): ExternalLambdaInstance<ExternalLambdaTarget> {
    return new GlobalExternalLambda<ExternalLambdaTarget>(key, target, matchExternalLambdaTarget);
}
