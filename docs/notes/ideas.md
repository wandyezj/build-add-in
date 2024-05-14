# Ideas

A collection of ideas that might improve the Build Add-In experience.

- [Hotkeys](#hotkeys)
- [Document Embed](#document-embed)

## Random

- Github Issues Tab
    - Clear set of labels for issues with description of what they mean and how they should be used.
    - Interact with customers often.
- Clear issue labels
    - Minimize labels to less than twenty too hard to keep track of otherwise.
    - key component names (run, edit, compile, monaco, blocks)
    - question - someone has a question, ideally it should be answered in documentation.
    - suggestion- someone has a suggestion for something
    - wont-fix
    - P0, P1, P2
    - by-design
    - duplicate
    - stale / old - not looking at this because too old and not relevant
- Be clear on intended use and what scenarios are supported
    - Refer to these scenarios when people ask for things outside of those scenarios.
- Clear local development documentation
- Have a set of pre canned responses
- Philosophy of do it well or don't do it.
- What is the difference between closing issues as not planned and closing them? When should you use either option?
- Is it possible to have the monaco shortcuts mirror vs code?
- Have an updates tab that displays a changelog of what has recently changed.
- Explanation of libraries tab
    - Explain that it only loads js, css, and types files as is.
    - We do not do any complex logic like trying to load a npm package. If you want to do that build a full website with a build system.
- Allow office.js and Office.d.ts to load from the localhost when there isn't internet.

- copy manifests to standard C:\share for testing on native, and prefix with the add-in name.

- Can I allow custom buttons to active specific snips?

- arbitrary snip import from URLs - show message if not successful
- export as publish zip with:
    - html file with {html, css, js} embedded or simply as separate files?
    - manifest.xml
    - default icon
    - snip.json
    - readme with instructions of how to publish on GitHub, clone simple repository put all files in, create site etc.., replace url in manifest etc, upload to store


- Make sure to validate any imported data. - Should probably be extended to anything in indexedDB as well. Assume any data where ever it's from is evil.





- GitHub gist importing
    - Fetch all of a users public gists
        - [GitHub get a gist](https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#list-gists-for-a-user)
        - `https://api.github.com/users/wandyezj/gists?per_page=2`
        - returns a list of N gists including links to all the raw files in the gists.
    - Get the content of a public gist
        - [GitHub get gist content](https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#get-a-gist)
        - `https://api.github.com/gists/e8720b3b12022f7247ba4ee76aca170f`
        - returns content of a gist
        - files."property (whatever file)".raw_url
        - load the raw urls content

- Store things on OneDrive
    - [Nested App Auth](https://learn.microsoft.com/en-us/office/dev/add-ins/develop/enable-nested-app-authentication-in-your-add-in)

- Snip signing with certificate or private key
    - Attempt to verify identity of a snip or only trust snips from specific entities.
    - Use PKI
    - Add a set of trusted signatures.
    - Signature can declare who the script is from.
    - Is there a list of public keys somewhere with with owners?
    - Need to verify signature against trusted authority.
    - [MDN Subtle Crypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
    - GitHub can [list GPG keys for a user](https://docs.github.com/en/rest/users/gpg-keys?apiVersion=2022-11-28#list-gpg-keys-for-a-user)
    - However reading the GPG key requires an authenticated user
    - Script hash would be signed with the private key, this way could show the specific GitHub customer that is being trusted.

- semi securely storing an auth token in local storage
    - [Crypto 101](https://www.crypto101.io/)
    - Place Big Warnings about PAT usage
    - Generate [PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
        - Set fine grain permissions
        - Set expiration
        - Token Name
        - Description
        - Gists = Read and write
        - GPG Keys = Read-only
    - encrypt the token when it is stored.
    - salt the encryption with random salt and require a password to unlock or a file of random text that is the key when the GitHub access is needed.


Tests

- What happens with snips with really long names?
- Capture tab key in monaco editor instead of moving around to buttons

## Hotkeys

Allow creation of a limited number of custom hotkeys. Only allow JS to execute. Requires shared runtime?

Hotkeys are code only functions that run when a key combination is pressed.

Only implement for document based hosts Word, Excel, PowerPoint.

New Taskpane titled Hotkeys

- allow creation of a script using TypeScript
- allow assigning of a script to a hotkey

Technical

- Shared runtime
- Hotkey assignment

- [Configure Shared Runtime](https://learn.microsoft.com/en-us/office/dev/add-ins/develop/configure-your-add-in-to-use-a-shared-runtime)
- [Keyboard Shortcuts](https://learn.microsoft.com/en-us/office/dev/add-ins/design/keyboard-shortcuts)
- [Keyboard Shortcuts Sample](https://github.com/OfficeDev/Office-Add-in-samples/tree/main/Samples/excel-keyboard-shortcuts)

- Shortcuts are Only Supported in Excel?
- Shared Runtime is only Excel and PowerPoint?

- Run hotkey functions in an iframe. This is challenging since need a way to forward office.js calls. So will probably simply execute in context, try to make sure global state is not disrupted.

Instead of iframe can embed in text before evaluation and hide some things that shouldn't be accessed via shadowing.

- Manifest changes
- Requirement sets
    - SharedRuntime 1.1
    - KeyboardShortcuts 1.1


JSON Shortcuts file
    - Add a bunch of blank hotkeys that can be overridden.
    - Hotkey1 - HotkeyN
    - Control sequence + alt key + Use 0 - 9

Key Sequence remap - not needed for prototype: Remap key sequence with: `Office.actions.associate`

What about the UI?

- Edit Script
- Manage Script
- Assign Hotkey Sequence to scripts

- Need data storage - create a new database table

## Document Embed

- Enable embedding snips in documents, possibly by adding custom xml tags and searching for them.
- double check any library urls
- provide firm guidance on what each piece does with an info box


## Visual Studio Code Extensions

Place an VS Code extension on the store that allows connection to the build extension and editing and running code.


