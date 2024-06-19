# GitHub Gist Storage

Create a source for GitHub gists.

## Display on UI

- [ ] Add GitHub storage location.
    - [] GitHub Icon
- [ ] Use Gist id as the id.
- [ ] Manual Save (so there are not multiple revisions)
    - Database entry for local copy, and version based on (only for edited)
    - When saved verify there hasn't been a revision (use created at and updated at)
        - if based off latest revision -> update
        - if newer revision -> dialog overwrite or create new gist.
    - provide option to public or private save
- [ ] Differentiate between private and public gists
- [ ] Only enable if a valid PAT is present
    - How to check if valid?
    - if any of the calls fail, say check the pat? (especially as PATs expire)
    - Offer to open URL: https://github.com/settings/personal-access-tokens and directions to Regenerate Token.
- [ ] Document how to use as a feature
