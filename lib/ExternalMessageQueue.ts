import { GlobalStorageKey, GlobalStorageKeyChange } from "./GlobalStorageKey";
import { getRandomGuid } from "./getRandomGuid";
import type { TargetId, MatchTargetMetadata, GetOwnTargetMetadata } from "./ExternalMessageTarget";
import { ExternalMessageTarget } from "./ExternalMessageTarget";

function getId(prefix: string = ""): string {
    return `${prefix}${prefix ? "-" : ""}${getRandomGuid()}`;
}

/**
 * A queued external message item.
 */
type MessageItem<MessageData> = {
    /**
     * A unique identifier for the message.
     */
    id: string;

    /**
     * The timestamp when the message was created. Used to detect stale messages.
     * `Date.now()` format.
     */
    created: number;

    /**
     * Message sender id.
     */
    from: TargetId;

    /**
     * Message recipient id.
     */
    to: TargetId;

    /**
     * The payload of the message.
     */
    data: MessageData;
};

/**
 * A queue of external lambda items.
 */
type MessageItemQueue<MessageData> = MessageItem<MessageData>[];

function getNewQueueItems<Data>(newValue: string, oldValue: string) {
    const itemsNew = JSON.parse(newValue) as MessageItemQueue<Data>;
    const itemsOld = JSON.parse(oldValue) as MessageItemQueue<Data>;

    // diff base on id
    const extractId = (o: MessageItem<Data>) => o.id;

    const idsNew = itemsNew.map(extractId);
    const idsOld = itemsOld.map(extractId);
    const newIds = idsNew.filter((id) => !idsOld.includes(id));

    // All Items
    const newItems = itemsNew.filter(({ id }) => newIds.includes(id));
    return newItems;
}

function getQueueItemsForTarget<MessageData>(
    queue: MessageItemQueue<MessageData>,
    target: TargetId
): MessageItemQueue<MessageData> {
    return queue.filter((value) => {
        return value.to === target;
    });
}

export class ExternalMessageQueue<TargetMetadata, MessageData> {
    #storage: GlobalStorageKey;

    #onStorageUpdate: GlobalStorageKeyChange;

    #target: ExternalMessageTarget<TargetMetadata>;

    constructor(
        key: string,
        ownTargetId: TargetId,
        getOwnTargetMetadata: GetOwnTargetMetadata<TargetMetadata>,
        matchTarget: MatchTargetMetadata<TargetMetadata>,
        handleMessage: (item: MessageItem<MessageData>) => Promise<void>
    ) {
        const queueKeyBase = `queue_${key}`;
        this.#storage = new GlobalStorageKey(`${queueKeyBase}`);

        this.#target = new ExternalMessageTarget<TargetMetadata>({
            key: `${queueKeyBase}-targets`,
            ownTargetId,
            getOwnTargetMetadata,
            matchTargetMetadata: matchTarget,
        });

        this.#onStorageUpdate = async ({ newValue, oldValue }) => {
            const newItems = getNewQueueItems<MessageData>(newValue ?? "[]", oldValue ?? "[]");
            const newItemsRelevant = getQueueItemsForTarget<MessageData>(newItems, this.#target.ownTarget);

            // Remove all items from queue that were read.
            const removeIds = newItemsRelevant.map((item) => item.id);
            await this.#removeItems(removeIds);

            for (const item of newItemsRelevant) {
                await handleMessage(item);
            }
        };

        this.#storage.onChange = this.#onStorageUpdate.bind(this);
    }

    get ownTarget(): TargetId {
        return this.#target.ownTarget;
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
    current(): MessageItemQueue<MessageData> {
        return JSON.parse(this.#storage.read() || "[]");
    }

    async #updateQueue(
        update: (currentQueue: MessageItemQueue<MessageData>) => MessageItemQueue<MessageData>
    ): Promise<void> {
        await this.#storage.update(async (dataOld) => {
            // Read
            const queue = JSON.parse(dataOld || "[]") as MessageItemQueue<MessageData>;

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

    async #addItem(item: MessageItem<MessageData>): Promise<void> {
        await this.#updateQueue((queue) => {
            // Update - add item to end of queue
            queue.push(item);
            return queue;
        });
    }

    async #sendMessage(to: TargetId, data: MessageData): Promise<void> {
        const item: MessageItem<MessageData> = {
            id: getId(),
            created: Date.now(),
            from: this.#target.ownTarget,
            to,
            data,
        };
        await this.#addItem(item);

        // Special handling for calls targeting the current global external lambda's own target.
        // The queue only alerts for diffs from different hosts.
        // If that target is self - force check the queue after the call has been written.
        if (to === this.#target.ownTarget) {
            await this.check();
        }
    }

    async send(to: TargetId, data: MessageData): Promise<void> {
        await this.#sendMessage(to, data);
    }
}
