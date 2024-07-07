# Sideload

[Sideload Add-Ins for testing](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/sideload-office-add-ins-for-testing)

For outlook web use:
https://outlook.live.com/mail/0/inclientstore

## Production

Download the production manifest:

- Get for [Word, Excel, and PowerPoint](https://store.office.com/app/download?assetid=WA200006798&cmu=en-US).
- Get for [Outlook](https://store.office.com/app/download?assetid=WA200006932&cmu=en-US).

If you are using a managed account, there is an IT setting that can disable loading from the store and a setting that can disable sideloading. If you can't access the store you might still be able to sideload.

## Testing

### Setup manifest share

As administrator run:
> .\scripts\create-manifest-share.cmd

### Copy over manifests

This copies over the latest manifests to the manifest share.

> npm run share