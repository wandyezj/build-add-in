# Ideas

A collection of ideas that might improve the Build Add-In experience.


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

- Enable embedding snips in documents, possibly by adding custom xml tags and searching for them.
- double check any library urls
- provide firm guidance on what each piece does with an info box

- hotkeys - allow creation of a limited number of custom hotkeys. Only allow JS to execute. Requires shared runtime?

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

Tests

- What happens with snips with really long names?
- Capture tab key in monaco editor instead of moving around to buttons