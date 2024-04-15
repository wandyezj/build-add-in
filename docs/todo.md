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

- [X] multiple local snip
- [X] storage scheme
- [X] storage system
    - [indexedDB basic pattern](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#basic_pattern)
- [X] multi snip display and selection
    - [X] Style the snips to display (display name, in order of last modified.)
        - [Card](https://react.fluentui.dev/?path=/docs/components-card-card--default)

## Phase - Publish

- [X] Icons Run and Edit
    - [X] Run
    - [X] Edit
- [X] Manifest - Cross Application
- [X] Manifest - Ribbon Tab - (Extension)
- [X] Store Publish
    - [X] Catchy Name = `Build` Add-In
    - [AppSource publishing](https://learn.microsoft.com/en-us/partner-center/marketplace/submit-to-appsource-via-partner-center)
        - [Offer Overview](https://partner.microsoft.com/en-us/dashboard/marketplace-offers/overview)
    - [X] Description Short
    - [X] Description Long
    - [X] Screen Shots
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

- [ ] Confirmation dialog before delete
- [ ] display compile errors
    - typescript pre emit diagnostics require program construction

## Phase - Multiple Files - Advanced

In the Local Snips drawer.

- [ ] Select Multiple
    - [ ] Allow download of select snips to a snips.json file.
    - [ ] Allow import of select snips from a snip.json file.
    - [ ] Allow delete of select Local Snips
- [ ] More graceful delete and new.
    - After delete open Local Snips drawer to selecting new snip to open.
- [ ] Allow pin of snips to the top of the Local Snips drawer.

## Phase - UI Polish

- [ ] Spinner when loading - [Spinner](https://fluent2.microsoft.design/components/web/react/spinner/usage)
- [X] Resizable Editor that adjusts to screen size
    - [ ] Find a better way to do this. The current way works but is not ideal. using 100vh on the container CSS and 90vh on the editor CSS.

## Phase - Samples

- [ ] Second page for samples [Multi-Level Drawer](https://react.fluentui.dev/?path=/docs/components-drawer--default#multiple-levels)
    - Alternative new menu
- [] Sample Conversion from yaml
    - https://gist.github.com/wandyezj/ce30cbfcc6df9f58ef0329481e62966b
    - Use a yaml library or a custom parse?
        - Would we ever want to save files as yaml? Probably not.
    - yaml libraries
        - Use this one? [js-yaml NPM](https://www.npmjs.com/package/js-yaml)
        - [yaml NPM](https://www.npmjs.com/package/yaml)
    - custom parser
        - Seems easy enough to write a custom parser since files are consistent.
    - There are some differences in run time environments
        - Library Reference Conversion
            - Remove Jquery
                - if importing samples replace library reference with url reference
            - Remove core-js
            - Replace others with direct links to unpkg



## Phase - test

- [ ] document all individual features in features.md
- [ ] create Playwright tests for every feature

## Phase - Nice

- [ ] global log function to ease debugging and silencing
- [X] import from url
- [ ] import multiple urls at once (one per line)
- [ ] run automatic refresh
    - [ ] add last update time to snip
    - [ ] detect when snip is updated simply check every second or so and compare 1. current sample name 2. last update time on snip.
    - [ ] redirect to own url to reload
- [ ] console component (not necessary since can use F12 tools)
- [ ] library load files from unpkg shorthand
- [ ] import yaml
    - auto inject Office.onReady call that does nothing if office.js is loaded as part of JavaScript API
- [ ] button - settings
    - [ ] settings - monaco editor
    - [ ] settings - typescript compiler
    - [ ] settings - set github name to show gists from
    - [ ] settings - turn debug logging on and off (turn off all in production)
- [ ] button - run in editor
    - Is there a point to this?

## Phase - Long Term Fix

- [ ] Copy to clipboard functionality is broken. It looks like the permissions were recently removed from the iframe policy? `<iframe src="index.html" allow="clipboard-read; clipboard-write"></iframe>`
    - [X] Workaround - use the command API


## Phase - Document

- [X] dependencies.md
    - why each dependency
    - how is each dependency used
- [X] vocabulary.md
    - names and definition for every item
- [ ] deployment infrastructure


## Phase - Accessibility

## Phase - Localize

i18n

- [ ] localize dates and times [MDN Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [ ] Open Source Machine Translation Tool?
- [ ] Copy Translations
    - https://github.com/microsoft/vscode-loc
    - https://github.com/microsoft/vscode-l10n


## Phase - Blocks

- [ ] Dynamic Blocks
    - [ ] Add arbitrary new blocks to end
        - [ ] New block validation
    - [ ] Remove block from end
- [ ] Block Library
- [ ] Include block steps in a snip

