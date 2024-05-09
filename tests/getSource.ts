/**
 * Route to use for testing
 */
export enum Source {
    /**
     * (default)
     * Use local dist.
     * Most robust for testing in a pipeline.
     */
    Dist,

    /**
     * Use local server.
     * Most useful for development.
     */
    Localhost,

    /**
     * Use production url
     */
    Production,
}

const sourceOverride: Source | undefined = undefined;

export function getSource() {
    if (sourceOverride !== undefined) {
        return sourceOverride;
    }

    const testMode = process.env["TEST_MODE"];

    if (testMode === "dist") {
        return Source.Dist;
    }

    if (testMode === "localhost") {
        return Source.Localhost;
    }

    return Source.Localhost;
}
