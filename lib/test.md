# Test

Tests for the different APIs

## getGitHubPersonalAccessToken

```typescript
async function test() {
    console.log("test");
    const token = Build.getGithubPersonalAccessToken();
    console.log(token);
    console.log(typeof token);
}
```

## getGitHubModelInference

```typescript
async function testInference() {
    console.log("test getGitHubModeInference");
    // "mistral-ai/ministral-3b"
    const inference: Build.GitHubModelInferenceParameters = {
        model: "openai/gpt-4.1",
        messages: [
            {
                role: "user",
                content: "What is the capital of France?",
            },
        ],
    };

    const response = await Build.getGitHubModelInference(inference);
    console.log(response);
}

async function testInferenceWithSystem() {
    // "mistral-ai/ministral-3b"
    const inference: Build.GitHubModelInferenceParameters = {
        model: "openai/gpt-4.1",
        messages: [
            {
                role: "system",
                content:
                    "You are an office.js Developer. When asked you only respond with office.js code to perform the expected task. Do not place the code between any markdown code blocks.",
            },
            {
                role: "user",
                content:
                    "Write me office.js code for Excel to set a range to 5 html color names, and then set and set each cell's background to its html color",
            },
        ],
    };

    const response = await Build.getGitHubModelInference(inference);
    console.log(response);
}
```

## getGitHubModelCatalogue

```typescript
async function testCatalog() {
    const cat = await Build.getGitHubModelCatalog();
    const values = cat.map((entry) => {
        const { id, name, publisher, html_url } = entry;
        return [id, name, publisher, html_url];
    });

    values.forEach((value) => {
        console.log(value.join(" | "));
    });
}
```
