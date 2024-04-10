# Setup

- [Basic](#basic)
- [Edit Manifests](#edit-manifests)
- [Test](#test)

## Basic

1. Install
    - [Node LTS](https://nodejs.org/en/download)

1. Clone this repository

1. Install dependencies
    > npm install

1. Build
    > npm run build

1. Local host
    > npm run start

1. Open browser to [http://localhost:8080](http://localhost:8080/)


## Edit Manifests

Add-In manifests are located in the [manifests folder](../manifests/).

Only make manual changes to base files:

- For Word, Excel, PowerPoint: [template.xml](../manifests/template.xml)
- For Outlook: [local.outlook.xml](../manifests/local.outlook.xml)

Other manifest files are generated from the base files using:

> npm run manifest

Once you have updates the manifests, test them via [sideloading](./sideloading.md).


## Test

> npm run playwright-install

> npm run build

> npm run playwright-test

> npm run playwright-report