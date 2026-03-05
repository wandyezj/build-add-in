/**
 * https://docs.github.com/en/rest/models/catalog
 * @beta
 */
export interface GitHubModelCatalogueEntry {
    id: string;
    name: string;
    publisher: string;
    registry: string;
    summary: string;
    html_url: string;
    version: string;
    capabilities: string[];
    limits: {
        max_input_tokens: number;
        max_output_tokens: number;
    };
    rate_limit_tier: string;
    supported_input_modalities: string[];
    supported_output_modalities: string[];
    tags: string[];
}
