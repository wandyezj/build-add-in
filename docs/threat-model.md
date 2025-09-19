# Threat Model

## Trusting the Build Add-In

The Build Add-In is continually updated. A deployment changes what code runs on the customers machine. Anyone who opens the Add-In gets and runs the latest code.

This is standard practice for Office Add-Ins. Office Add-In manifests specify the url to load the Add-In from, and the code latest code is loaded - just like a standard website.

This means the system that integrates changes, builds, deploys, and hosts the code must be secure.

Finally, anyone who contributes to the Build Add-In codebase must be trustworthy.

## How could the Build Add-In be abused?

The build Add-In runs arbitrary code - __By Design__ - as core functionality.

People could be tricked into running naughty code.

- Copy and paste a snip
- Copy and paste: JavaScript, Html, library
- Open a snip embedded in a document.

## What kinds of things can a snip do?

- It's the same as opening a website.
- It can read and write data to the Office Document it's opened in.
- Manipulate Build Add-In storage - the snip does not run in a separate domain or iframe.

## What kinds of things would attackers do?

- Data exfiltration
    - Read data from a document
    - Trick customers into entering certain data - like a website.
- Data manipulation
    - Write data to a document
- Data loss
    - Write data to a document to remove or change it

## Who are the likely targets for abuse?

- Enterprise - business, schools, non-profits
- Consumer - individuals

Enterprise customers are the most likely target since they have valuable information.

Large Enterprise customers have dedicated IT departments who can use admin controls to restrict what Add-Ins are allowed in their organization and who can access them. They would need to do this anyway since any Add-In can do more than what the Build Add-In allows. Generally most organizations should restrict access to Add-Ins by default.

Small Enterprise customers may not have a dedicated IT department and may have a more unknown security posture. They may not be as informed about complicated security controls.

Consumer customers don't have an IT department, they need to look out for themselves.

## What could be done to mitigate abuse?

- Warning in description about running untrusted code.
- Warning dialog on first open about running untrusted code.
- Warning when importing code about running untrusted code.
- Enterprise customers can restrict Add-Ins to only a set of trusted Add-Ins. They can also restrict side loading of Add-Ins.
- Allow snips to contain signatures to identify authors.


