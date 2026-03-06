# Test 

Tests for the different APIs

```typescript
async function test() {
    console.log("test")
    const token = Build.getGithubPersonalAccessToken();
    console.log(typeof token);

    // This is allowed
    //await testInference(token);


    await testCat(token);

}

async function testInference(token) {
    const inf = await getGithubModelInference(token);
    console.log(inf)
}

async function testCat(token) {
    //Test Catalogue
    //const cat = await Build.getGitHubModelCatalog(token);
    const cat = await getGitHubModelCatalog(token);
    const values = cat.map(entry => {
        const { id, name, publisher } = entry;
        return [id, name, publisher]
    });

    values.forEach(value => {
        console.log(value)
    })

}

```


```typescript

async function testInference() {
    // "mistral-ai/ministral-3b"
    const inference: Build.GitHubModelInferenceParameters = {
        model: "openai/gpt-4.1",
        messages: [
                { 
                    role: "user",
                    content: "What is the capital of France?"
                }
            ]
    };

    const response = await Build.getGitHubModelInference(inference);
    console.log(response)
}

async function testInferenceWithSystem() {
    // "mistral-ai/ministral-3b"
    const inference: Build.GitHubModelInferenceParameters = {
        model: "openai/gpt-4.1",
        messages: [
                { 
                    role: "system",
                    content: "You are an office.js Developer. When asked you only respond with office.js code to perform the expected task. Do not place the code between any markdown code blocks."
                },
                { 
                    role: "user",
                    content: "Write me office.js code for Excel to set a range to 5 html color names, and then set and set each cell's background to its html color"
                }
            ]
    };

    const response = await Build.getGitHubModelInference(inference);
    console.log(response)
}



async function testCatalog() {

    const cat = await Build.getGitHubModelCatalog();
    const values = cat.map(entry => {
        const { id, name, publisher, html_url } = entry;
        return [id, name, publisher, html_url]
    });

    values.forEach(value => {
        console.log(value.join(" | "))
    })
}



```

```javascript
Excel.run(function (context) {
    var sheet = context.workbook.worksheets.getActiveWorksheet();
    var range = sheet.getRange("A1:E1");
    var colorNames = ["red", "green", "blue", "yellow", "purple"];

    // Set the values of the range
    range.values = [[colorNames[0], colorNames[1], colorNames[2], colorNames[3], colorNames[4]]];

    // Set the background color of each cell
    for (var i = 0; i < colorNames.length; i++) {
        var cell = range.getCell(0, i);
        cell.format.fill.color = colorNames[i];
    }

    return context.sync();
}).catch(function(error) {
    console.log("Error: " + error);
});
```