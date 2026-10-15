import { GlobalStorageKey } from "./GlobalStorageKey";

/**
 * Identifier for an external sender or receiver.
 */
export type TargetId = string;

/**
 * Compares two external lambda targets for equality.
 * @public
 */
export type MatchTargetMetadata<TargetMetadata> = (a: TargetMetadata, b: TargetMetadata) => boolean;

export type GetOwnTargetMetadata<TargetMetadata> = () => Promise<TargetMetadata>;

function shouldUpdate(lastUpdate: number | undefined, maximumDeltaMilliseconds: number): boolean {
    if (lastUpdate === undefined) {
        return true;
    }
    const now = Date.now();
    return now - lastUpdate > maximumDeltaMilliseconds;
}

export class ExternalMessageTarget<TargetMetadata> {
    /**
     * Request that all targets update with latest metadata.
     */
    #storageTargetsRequestRefresh: GlobalStorageKey;
    #storageTargets: GlobalStorageKey;
    #storageTarget: GlobalStorageKey;

    #ownTargetId: TargetId;
    #ownTargetMetadata: TargetMetadata | undefined;
    #ownTargetMetadataLastUpdate: number | undefined;

    #getOwnTargetMetadata: GetOwnTargetMetadata<TargetMetadata>;
    #matchTargetMetadata: MatchTargetMetadata<TargetMetadata>;

    #requestUpdateMaximumDeltaMilliseconds: number = 10_000;

    constructor({
        key,
        ownTargetId,
        getOwnTargetMetadata,
        matchTargetMetadata,
    }: {
        key: string;
        ownTargetId: TargetId;
        getOwnTargetMetadata: GetOwnTargetMetadata<TargetMetadata>;
        matchTargetMetadata: MatchTargetMetadata<TargetMetadata>;
    }) {
        this.#storageTargets = new GlobalStorageKey(`${key}_targets`);
        this.#storageTargetsRequestRefresh = new GlobalStorageKey(`${key}_request_metadata_refresh`);
        this.#storageTarget = new GlobalStorageKey(`${key}_target_${ownTargetId}`);

        this.#ownTargetId = ownTargetId;

        this.#getOwnTargetMetadata = getOwnTargetMetadata;
        this.#matchTargetMetadata = matchTargetMetadata;
    }

    async updateOwnTargetMetadata() {
        if (shouldUpdate(this.#ownTargetMetadataLastUpdate, this.#requestUpdateMaximumDeltaMilliseconds)) {
            this.#ownTargetMetadata = await this.#getOwnTargetMetadata();
            const now = Date.now();
            this.#ownTargetMetadataLastUpdate = now;
            this.#storageTarget.update(async () => {
                return JSON.stringify({
                    lastUpdate: now,
                    targetId: this.#ownTargetId,
                    metadata: this.#ownTargetMetadata,
                });
            });
        }
    }

    async addOwnTargetId() {
        // Add initial target to list in local storage
        await this.#storageTargets.update(async (dataOld) => {
            type StorageTargets = TargetId[];

            const defaultStorageTargets: StorageTargets = [];
            const targets = dataOld ? (JSON.parse(dataOld) as StorageTargets) : defaultStorageTargets;

            if (!targets.includes(this.#ownTargetId)) {
                targets.push(this.#ownTargetId);
            }
            return JSON.stringify(targets);
        });
    }

    /**
     * Updates the storageTargetsRequestUpdate timestamp if the maximum delta has been exceeded.
     * This triggers an update request for all external message targets.
     */
    async #requestTargetRefresh() {
        // Update own target metadata
        await this.updateOwnTargetMetadata();

        let lastRequest = 0;
        try {
            const value = this.#storageTargetsRequestRefresh.read();
            if (typeof value === "string") {
                lastRequest = parseInt(value, 10);
            }
        } catch {
            // Ignore errors reading the last request timestamp
        }

        const now = Date.now();
        const shouldRequestUpdate = now - lastRequest > this.#requestUpdateMaximumDeltaMilliseconds;
        if (shouldRequestUpdate) {
            this.#storageTargetsRequestRefresh.update(async () => {
                return JSON.stringify(now);
            });
        }
    }

    async initialize() {
        await this.updateOwnTargetMetadata();
        await this.addOwnTargetId();
    }

    async refreshTargets() {
        await this.#requestTargetRefresh();
    }

    // TODO: refresh the target list from storage

    get ownTarget(): TargetId {
        return this.#ownTargetId;
    }

    get ownTargetMetadata(): TargetMetadata {
        if (this.#ownTargetMetadata === undefined) {
            throw new Error("Own target metadata has not been initialized.");
        }
        return this.#ownTargetMetadata;
    }
}
