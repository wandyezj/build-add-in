# Tutorial

The Build Add-In is a tool to allow you to create snips to extend Word, Excel, and PowerPoint using the Office.js API.

Each snip consists of TypeScript, HTML, and CSS.

The Build Add-In provides a way to create, edit, run and share these snips.

## Quick Tutorial

Create, edit, and run your first snip.

1. Open the _Edit Taskpane_
    1. Click the `Build` tab on the ribbon.
    1. Click the `Edit` button.
    1. Wait for the _Edit taskpane_ to open on the right of the document.
1. Create a new default snip, In the _Edit Taskpane_
    1. Click the `Open Snip` Icon to open the `Local Snips` flyout and view all local snips. (There shouldn't be any yet)
    1. In the `Local Snip` flyout, click `New Snip`.
    1. You should see a snip named `Default Snip` appear.
    1. Click the new Default Snip
1. Edit the Snip
    1. Rename the snip
    1. Edit the snips HTML
        1. Click the `HTML` tab in the _Edit taskpane_
        1. In the HTML editor add a new Paragraph `<p>Hello World!</p>`
1. Run the snip
    1. Click the `Build` tab on the ribbon.
    1. Click the `Run` button.
    1. Wait for the _Run taskpane_ to open on the right of the document.
    1. Wait for snip to load.

## Features

- [Create](#create)
- [Run](#run)
- [Edit](#edit)
- [Share](#share)
- [Backup](#backup)

### Create

To create a snip:

1. Click the `Build` tab on the ribbon.
1. Click the `Edit` button.
1. Wait for the _Edit taskpane_ to open on the right of the document.
1. Click the Plus Icon to create a new default snip

### Run

To run the currently open snip:

1. Click the `Build` tab on the ribbon.
1. Click the `Run` button.
1. Wait for the _Run taskpane_ to open on the right of the document.

The current snip open in the _Edit taskpane_ will run.

The `Run taskpane` will load the CSS, HTML, and JavaScript from the snip into the window.

### Edit

In the `Edit taskpane`:

- `Open Snip` - Open a snip to edit.
- Select the snip file to edit by clicking `TS`,`HTML`, or `CSS`. 
- Use the editor to modify the file, your changes will automatically save as you edit.

### Share

Snips are saved in local storage. You can backup and share your snips in the `Edit taskpane`.

- Click `Copy to clipboard` to get a copy of currently open snip for sharing.
- Click `Import` to load a copied snip, it will open a dialog you can paste a snips text into.

#### Backup

In `Local Snips flyout` in the`Edit taskpane`.

- Click `Download All Snips` to download a snips.json file with a copy of all local snips.
- Click `Upload Snips` to upload a new copy of all snips in a snips.json file.

