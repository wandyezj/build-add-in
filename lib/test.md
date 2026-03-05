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
