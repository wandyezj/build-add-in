# To Do

## Phase - Basic

- [x] Edit
- [x] Run
- [x] Office Add-In manifest
- [X] external file loading
    - [X] js
    - [X] css
    - [X] .d.ts
- [X] editor intellisense (office.d.ts)
- [X] button import
- [X] compile typescript

## Phase - Multiple Files

- [ ] multiple local snip
- [X] storage scheme
- [X] storage system
    - [indexedDB basic pattern](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#basic_pattern)
- [X] multi snip display and selection
    - [X] Style the snips to display (display name, in order of last modified.)
        - [Card](https://react.fluentui.dev/?path=/docs/components-card-card--default)
- [ ] Second page for samples [Multi-Level Drawer](https://react.fluentui.dev/?path=/docs/components-drawer--default#multiple-levels)
- [ ] More graceful delete and new. After delete switch to selecting new snip to open.


## Phase - Publish

- [X] Icons Run and Edit
    - [X] Run
    - [X] Edit
- [X] Manifest - Cross Application
- [X] Manifest - Ribbon Tab - (Extension)
- [ ] Store Publish
    - [ ] Catchy Name (Build?)
    - [AppSource publishing](https://learn.microsoft.com/en-us/partner-center/marketplace/submit-to-appsource-via-partner-center)
        - [Offer Overview](https://partner.microsoft.com/en-us/dashboard/marketplace-offers/overview)
    - [X] Description Short
    - [X] Description Long
    - Screen Shots
        - Walk through and screen shots of how to use
        - (1) Go to Extension tab (2) Click Edit, edit your snip (3) click run button to run the current snip. (4) observe running.
        - Update sample with the color of the host.
    - submission
    - [X] Required statements
        - [X] eula
        - [X] privacy
        - [X] support
    - [ ] Publisher Attestation
        - After publish
        - Say no to everything - be explicit that there is limited support and it is updated at whim.

## Phase - Important

- [ ] Warn before delete
- [ ] display compile errors
    - typescript pre emit diagnostics require program construction

## Phase - Fix

- [ ] Copy to clipboard functionality is broken. It looks like the permissions were recently removed from the iframe policy? `<iframe src="index.html" allow="clipboard-read; clipboard-write"></iframe>`
    - [X] Workaround - use the command API

## Phase - UI Polish

- [ ] Spinner when loading - [Spinner](https://fluent2.microsoft.design/components/web/react/spinner/usage)
- [X] Resizable Editor that adjusts to screen size
    - [ ] Find a better way to do this. The current way works but is not ideal. using 100vh on the container CSS and 90vh on the editor CSS.


## Phase - test

- [ ] always an open snip
- [ ] always something to run

## Phase - Nice

- [ ] global log function to ease debugging and silencing
- [ ] import from url
- [ ] run automatic refresh
    - [ ] add last update time to snip
    - [ ] detect when snip is updated simply check every second or so and compare 1. current sample name 2. last update time on snip.
    - [ ] redirect to own url to reload
- [ ] samples
- [ ] console component (not necessary since can use F12 tools)
- [ ] library load files from unpkg shorthand
- [ ] import yaml
    - auto inject Office.onReady call that does nothing if office.js is loaded as part of JavaScript API
- [ ] button - settings
    - [ ] settings - monaco editor
    - [ ] settings - typescript compiler
- [ ] button - run in editor
    - Is there a point to this?

## Phase - Document

- [X] dependencies.md
    - why each dependency
    - how is each dependency used
- [ ] deployment infrastructure

## Phase - Blocks

- [ ] Dynamic Blocks
    - [ ] Add arbitrary new blocks to end
        - [ ] New block validation
    - [ ] Remove block from end
- [ ] Block Library
- [ ] Include block steps in a snip