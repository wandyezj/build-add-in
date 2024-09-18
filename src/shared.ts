// Shared runtime, will be used for snips that should run in the background.

import { setupOffice } from "./core/setupOffice";

// Some rules for snips to run in the background
// must
//  - only allow one to run in the background
//  - be embedded in the document
//  - only have default library references

// Want a button to go back from currently loaded
// Want a button to load a new one.

async function setup() {
    await setupOffice();

    // After the first time the add in is opened it will automatically load
    Office.addin.setStartupBehavior(Office.StartupBehavior.load);

    // redirect to edit and allow back
    window.location.href = "./run.html#back";
    // back will act as reload in this case.
}

setup();
