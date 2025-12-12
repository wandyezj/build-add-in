# Features

A full list of all features.

- Taskpanes
    - Edit
    - Run
    - Help

- Import (in edit)
    - snip Json
    - url to snip Json
    - gist with single file containing snip Json

- Save / Load (in edit)
    - file
        - with snip Json
        - with array of snips Json

- Embed (in edit)
    - Only supported in: Excel and Word (needs the Custom XML API)
    - embed snip in document
    - Run an embed script
    - Delete an embed script

- Open (web)
    - Allow creation of links to open a specific snip
    - `https://wandyezj.github.io/build-add-in/run.html?open=<gist id>`
    - [Example](https://wandyezj.github.io/build-add-in/run.html?open-gist=b0c4a25ff96a7514756fef6e08fae968)

- Copy to clipboard

- Delete

- Persist local data using navigation.storage.persist
    - This works in browser.
    - This does NOT work in native host.

- Ignore `Ctrl + S` key combo in editor.

- Samples
    - All relevant samples load and run.
    - Only samples relevant to current host are shown.
