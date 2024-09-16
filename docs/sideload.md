# Sideload

[Sideload Add-Ins for testing][sideload-docs]

For outlook web use:
https://outlook.live.com/mail/0/inclientstore

## Production

Download the production manifest:

- Get for [Word, Excel, and PowerPoint](https://store.office.com/app/download?assetid=WA200006798&cmu=en-US).
- Get for [Outlook](https://store.office.com/app/download?assetid=WA200006932&cmu=en-US).

If you are using a managed account, there is an IT setting that can disable loading from the store and a setting that can disable sideloading. If you can't access the store you might still be able to sideload.


## Setup manifest share

As administrator run:
> .\scripts\create-manifest-share.cmd

## Copy over manifests

This copies over the latest manifests to the manifest share.

> npm run share

## Load the local manifest

Basic manifests are located in the [manifests folder](../manifests/)

Follow: [Sideload Add-Ins for testing][sideload-docs]

Load

- `local.xml` for Word, Excel, PowerPoint.
- `local.outlook.xml` for Outlook.

Click the `[Local]` Ribbon Tab to view the local version.

### Sideloading Outlook Web

[Install Teams Toolkit cli](https://www.npmjs.com/package/@microsoft/teamsapp-cli)

> npm install -g @microsoft/teamsapp-cli

[Install the Manifest](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/teams-toolkit-cli?pivots=version-three#teamsapp-install)

> teamsapp install --xml-path manifest.xml

Where `manifest.xml` is the path to the manifest.


[sideload-docs]: https://learn.microsoft.com/en-us/office/dev/add-ins/testing/sideload-office-add-ins-for-testing