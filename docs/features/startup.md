# Startup

The idea of startup is to allow running a snip as part of opening a document.

## Pieces

- Separate Manifest and store entry
- Shared Runtime
- Ribbon Button under the build tab.
    - Open Current
    - Management Pane

## Security Model

- Separate Add-In that has to be installed separately.
- Show dialog before running script
- Consent per {script, document} pair.
    - id script = script hash + local storage salt
    - id document = hash of {use url or persist id} + local storage salt
    - Store consent record in local storage
- Permissions
    - Use CSP to enforce permissions
    - require declaring permissions in dialog.

## Shared runtime questions

- Does opening a new document close the existing shared runtime?
- How to refresh the exiting runtime

## APIs

- `context.workbook.settings`
    - Where are these settings stored? Are they accessible in the documents XML?
    > Settings are unique to a single Excel file and add-in pairing.

[Start and Settings](https://learn.microsoft.com/en-us/office/dev/add-ins/develop/persisting-add-in-state-and-settings)

- `Office.context.document.url`
    - [url](https://learn.microsoft.com/en-us/javascript/api/office/office.document?view=common-js-preview#office-office-document-url-member)
    > Gets the URL of the document that the Office application currently has open. Returns null if the URL is unavailable.

- [Dialog API](https://learn.microsoft.com/en-us/office/dev/add-ins/develop/dialog-api-in-office-add-ins)