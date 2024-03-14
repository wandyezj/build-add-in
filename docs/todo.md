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

## Phase - UI Polish

- [ ] Resizable Editor that adjusts to screen size

## Phase - Multiple Files

- [ ] multiple local snip
    - [X] storage scheme
    - [X] storage system
        - [indexedDB basic pattern](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#basic_pattern)
    - [ ] multi snip display and selection

## Phase - Publish

- [X] Icons Run and Edit
    - [X] Run
    - [X] Edit
- [X] Manifest - Cross Application
- [X] Manifest - Ribbon Tab - (Extension)
- [ ] Store Publish
    - [ ] Catch Name (Build?)
    - [AppSource publishing](https://learn.microsoft.com/en-us/partner-center/marketplace/submit-to-appsource-via-partner-center)
        - [Offer Overview](https://partner.microsoft.com/en-us/dashboard/marketplace-offers/overview)
    - [X] Description Short
    - [X] Description Long
    - Screen Shots
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

## Phase - test

- [ ] always an open snip
- [ ] always something to run

## Phase - Nice

- [ ] global log function to ease debugging and silencing
- [ ] import from url
- [ ] run automatic refresh
- [ ] samples
- [ ] console component (not necessary since can use F12 tools)
- [ ] library load files from unpkg shorthand
- [ ] import yaml
- [ ] button - settings
- [ ] settings - monaco editor
- [ ] settings - typescript compiler
- [ ] button - run in editor

## Phase Document

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