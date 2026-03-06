/* eslint-disable @typescript-eslint/naming-convention */

/**
 * https://docs.github.com/en/rest/models/catalog
 *
 * @beta
 */
export interface GitHubModelCatalogueEntry {
    /**
     * The unique identifier for the model.
     */
    id: string;

    /**
     * The name of the model.
     */
    name: string;

    /**
     * The publisher of the model.
     */
    publisher: string;

    /**
     * The registry where the model is listed.
     */
    registry: string;

    /**
     * A brief summary of the model's capabilities.
     */
    summary: string;

    /**
     * The URL to the model's detail page.
     */
    html_url: string;

    /**
     * The version of the model.
     */
    version: string;

    /**
     * A list of capabilities supported by the model.
     */
    capabilities: string[];

    /**
     * The limits for the model, including input/output token limits.
     */
    limits: {
        /**
         * The maximum number of input tokens allowed.
         */
        max_input_tokens: number;

        /**
         * The maximum number of output tokens allowed.
         * note: the specification says number, but some models have null for this value.
         */
        max_output_tokens: number | null;
    };

    /**
     * The rate limit tier for the model.
     */
    rate_limit_tier: string;

    /**
     * A list of input modalities supported by the model.
     */
    supported_input_modalities: string[];

    /**
     * A list of output modalities supported by the model.
     */
    supported_output_modalities: string[];

    /**
     * A list of tags associated with the model.
     */
    tags: string[];
}
