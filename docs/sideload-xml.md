# Sideload the Build Add-In locally


## On Windows

1. Create a local share folder
    - Run as admin: [create-manifest-share.cmd](../scripts//create-manifest-share.cmd)
2. Add shared folder to trusted catalogue
    - Run as current user: [create-manifest-share-entry.cmd](../scripts//create-manifest-share-entry.cmd)
3. Download the Build Add-In Manifest
    - [Word, Excel, and PowerPoint](https://store.office.com/app/download?assetid=WA200006798)
    - [Outlook](https://store.office.com/app/download?assetid=WA200006932)
4. Copy the downloaded manifest to the share
5. Add the Add-In via
    - Home > Add-ins > advanced
    - click refresh
    - click the Add-In


## Reference

[Use Network Share Catalogue on Windows](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/create-a-network-shared-folder-catalog-for-task-pane-and-content-add-ins)