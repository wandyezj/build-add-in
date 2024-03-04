# Architecture

This is a Office JS Add-In.

The Add-In compiles to static sources to be hosted.

## Purpose

The purpose of this Add-In is to:

- Provide a playground to test out office.js APIs.
- Simplify building miniature Add-Ins.
- Allow sharing of snips to testing and debugging.

A [snip](#snip) is the unit of code that is editable and run.

There are two pages:

- [Edit](#edit-page): `edit.html`
- [Run](#run-page): `run.html`

## Snip

Each snip has:

- name
    - A descriptive name for the snip
- Libraries
    - links to libraries the snip loads before running
- CSS
    - stylesheet
- HTML
    - html that forms the UI of the snip, this is injected into the body of the run page.
- ts
    - the code that is run

### Libraries

http links

- css links are loaded
- js links are loaded

## Edit Page

The edit page allows:

- editing of snips

## Run Page

The run page loads all resources before the snip code is allowed to run.