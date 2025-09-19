# Sign Embed

Currently the Build Add-In allows embedding snips into Excel and Word documents as a means of distribution.

People can open these snips and run them.

Currently, it isn't easy for people to verify where snips come from or who the author might be.

Authors creating snips and embedding them in documents don't have a way to tell people hey it's from me and you trust me so you should trust this code.


We want a better trust model can can help people verify where a snip comes from.

Consent Model

- We want to help people make informed choices about other peoples code that they run.


What would the UX look like? How would this work?

There are two different customers

- authors - writers
    - the creator of the snip - wants a way to tell people - hey this is from me.
- runners - readers
    - the user of the snip - wants a way to tell who the snip is from.

## Scenarios

Before running the snip we would show a dialog that explains it's dangerous to run unknown code from untrusted authors, and the specific potential consequences to running the snip, and it would ask: do you trust this snip by "Unknown Author" ?

We don't ask them if they want to run the snip - because the obviously want to run it - they clicked run. We want them to think about the consequences of running for this specific snip.

- If they select yes then we add the snip to a list of trusted snips to avoid prompting again, then run the snip.
- If they select no, we add the snip to a list of denied snips, we don't run the snip. They will be prompted again with a warning that it was previously denied.

### No signature & Unknown Author

By default all embedded snips are from Unknown authors.

### With Signature & Untrusted Author

Show dialog filling in the author and providing information, we would instead say "Untrusted Author"

### With Signature & Trusted Author

Show dialog filling in the author with a check mark showing they are trusted.
How to trust the author? Add them to a trusted author list in a separate step.

## How to Sign and Verify

Hooking into an existing identity model that ties public keys to users.

GitHub hosts GPG keys linked to accounts.

## Create Signature

0. Require that the author have a GitHub account and have published a public key.
1. Prompt for information about the signature
    - snip
    - GitHub username -> text box
    - public key id -> dropdown from loaded keys
2. Provide text to sign containing:
    - snip
    - date
    - GitHub username
    - public key id
3. Author uses their private key to sign the text using gpg
4. Get the signature from the author
5. Verify that the signature works.
6. Store the signature with the document

### Use GPG to Sign

> gpg --output doc.sig --detach-sig doc

> gpg --verify doc.sig doc

The sig file is in binary format and contains different packets.

> gpg --list-packets doc.sig

## Verify Signature

1. check that text blob corresponds to the embed snip
2. Read specified GitHub users specified public key
3. Check the key was not revoked.
4. Check that the signature matches up with the public key.


If the signature matches up - then it's likely that the GitHub user signed it - or their key was hacked,


### Verify With JavaScript

[Get User GPG key](https://docs.github.com/en/rest/users/gpg-keys?apiVersion=2022-11-28)

> GET https://api.github.com/users/USERNAME/gpg_keys

- This does not work because it does not show the full armored key.


The following reveals an armored key for the specific GitHub user. This contains their full set of GPG keys. If there are no GPG keys it returns the text `Not Found`
> https://github.com/USERNAME.gpg

[MDN SubtleCrypto/verify](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/verify)

> verify(algorithm, key, signature, data)

[Open PGP JS](https://openpgpjs.org)
    - [Open PGP JS on NPM](https://www.npmjs.com/package/openpgp)
    - [verify](https://docs.openpgpjs.org/global.html#verify)
        - Takes in the signature and the public key.


## About PGP

PGP created Public and Private Key pairs. The keys can then be used in various algorithms

## Sign and Verify With JavaScript

Use the SubtleCrypto library to create a key pair, have the public key be hosted somewhere and then just verify the signature

## Look up GitHub username from email

> https://api.github.com/search/users?q=wandyezj@gmail.com


## What changes to make?

Allow embedding gpg signatures as a property of a snip.

Create a badge on the edit page toolbar to show the author.

- UX options
    - Icons
        - CertificateRegular
        - SignatureRegular
        - DocumentSignatureRegular
        - ContactCardRegular
        - ContactCardLinkRegular
        - ContactCardRibbonRegular
        - FingerprintRegular
        - LinkPersonRegular
        - RibbonRegular
        - ShieldRegular
        - ErrorCircleRegular
    - Button
        - Make it a regular button
    - [Tag](https://react.fluentui.dev/?path=/docs/components-tag-tag--docs)
        - Tag with Icon that is clickable
    - [Info Label](https://react.fluentui.dev/?path=/docs/components-infolabel--docs)

- Add switch for signature
    - Add note "Adding a signature requires understanding GPG"

- UX Controls
    - Required Actions
        - sign
        - display signature
        - remove signature
    - Option: Button and Dialog
        - Add button in the edit pane activated by switch
        - Add dialog with the controls
        - Separate dialog to sign and another to view?
    - Option: Tab next to libraries
        - Add separate pane for signature that contains what the dialog has.
        - Probably makes the most sense - but more complex

- Store the signature with the embedded snip as a new file type.
    - add optional author : {source: "GitHub", username: "author"} field to Snip - where to retrieve the GPG key
    - add optional signature file to Snip.
        - This will contain the gpg signature.
        - {signature: string, }

- Snip to hash text function - create a consistent ordering of the snip data

- Provide Steps to get the signature
    - Download of hash text to sign
    - Upload of signature for text

- Function to verify signature
    - Retrieve GPG key from GitHub based on username
    - verify 