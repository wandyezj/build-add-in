# AI

Can the Build Add-In integrate with an AI model to update snips based on instructions?


## Scenarios

Overall: Allow someone to build simple web tools, step by step.

What kinds of tools?

- Simple tools
    - simple text editor with file upload and download
    - configurable checklists
    - basic financial models

- Interactions with documents using office.js
    - Think about all of the existing sample scenarios.

- Charting or mockups with libraries?
    - mermaid
    - d3.js
    - markdown

- Common Web APIs?
    - datamuse
    - GitHub

How good is the AI? How much hand holding does it need?

How do we increase the chance people using the tool succeed?

What kind of guidance should be provided? Are there pre selected prompts?

Are there simple building blocks? Or simple tools that can be highly accurate?

How easy can you really make it to succeed?

How do you make maintainance easy afterwards?

## Customer Journey


## Things to update

UI

- Buttons
- Headers
- Inputs
- Styling

## Technical

How would this work?

Two options:

- Integrate inside application
- Integrate with VS Code via websockets

Decision: better to integrate inside of the application - it's more convenient from a customer perspective.


### Calling an AI model

[GitHub REST API for model inference](https://docs.github.com/en/rest/models/inference)

Add `models: read` scope to personal access token. Use the token to access the API.

The API supports tool calls but these will need to be handled by the model.

How does the context work with the model?

- A chat context is provided.

### UX

- Call API to get a list of supported models
- New Settings
    - Enable Feature
    - Select Model

- Need a way to provide

### Fine Tuning Model

How good is the model already? How much direction is needed overall?

What kinds of hints are useful?

What kinds of tools are useful?

- Check compilation and report errors?
- Check UX?


Can standard conventions and code style be enforced to increase probability the model gets things right?

