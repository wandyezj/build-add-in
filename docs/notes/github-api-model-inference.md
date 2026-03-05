# GitHub API Model Inference

## Model Catalogue

[GitHub REST API for model catalogue](https://docs.github.com/en/rest/models/catalog)

```text
Headers:

"Accept: application/vnd.github+json"
"Authorization: Bearer <YOUR-TOKEN>"
"X-GitHub-Api-Version: 2022-11-28"

Url:

https://models.github.ai/catalog/models


```

```typescript
interface GitHubModelCatalogueEntry {
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

type GitHubModelCatalogueResponse = GitHubModelCatalogueEntry[];
```

[GitHub REST API for model inference](https://docs.github.com/en/rest/models/inference)

Add `models: read` scope to personal access token. Use the token to access the API.
