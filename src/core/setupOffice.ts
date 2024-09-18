import { setHost, setPlatform } from "./globals";

import {
    AccountInfo,
    createNestablePublicClientApplication,
    IPublicClientApplication,
    LogLevel,
    SilentRequest,
    PublicClientNext,
} from "@azure/msal-browser";

let publicClientApplication: IPublicClientApplication | undefined = undefined;

/**
 * Can be called once office is initialized.
 */
export function getPublicClientApplication(): IPublicClientApplication {
    if (publicClientApplication === undefined) {
        throw new Error("public client application not initialized");
    }
    return publicClientApplication;
}

async function testNaa() {
    const pca = getPublicClientApplication();

    // Specify minimum scopes needed for the access token.
    const tokenRequest = {
        scopes: [
            "email",
            //"Files.Read",
            //"User.Read",
            //"openid",
            //"profile",
        ],
    };
    let accessToken = null;

    // Step 1 - Call acquireTokenSilent.
    try {
        // const accounts = pca.getAllAccounts();
        // console.log(accounts.length); // no accounts?
        // const tokenRequestSilent: SilentRequest = {
        //     ...tokenRequest,
        //     account: pca.getActiveAccount() || undefined,
        // };
        console.log("Trying to acquire token silently...");
        //const token = await Office.auth.getAccessToken();

        // pca.setActiveAccount({

        // });
        const userAccount = await pca.acquireTokenSilent(tokenRequest);
        console.log("Acquired token silently.");
        accessToken = userAccount.accessToken;
    } catch (error) {
        console.log(`Unable to acquire token silently: ${error}`);
    }

    // Step 2 - Call acquireTokenPopup.
    if (accessToken === null) {
        // Acquire token silent failure. Send an interactive request via popup.
        try {
            console.log("Trying to acquire token interactively...");
            const userAccount = await pca.acquireTokenPopup(tokenRequest);
            console.log("Acquired token interactively.");
            accessToken = userAccount.accessToken;
        } catch (popupError) {
            // Acquire token interactive failure.
            console.log(`Unable to acquire token interactively: ${popupError}`);
        }
    }

    // Step 3 -  Log error if token still null.
    // Log error if both silent and popup requests failed.
    if (accessToken === null) {
        console.error(`Unable to acquire access token.`);
        return;
    }

    // Step 4 - Call the Microsoft Graph API.
    // Call the Microsoft Graph API with the access token.
    const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root/children?$select=name&$top=10`, {
        headers: { Authorization: accessToken },
    });

    if (response.ok) {
        // Write file names to the console.
        const data = await response.json();
        const names = data.value.map((item: any) => item.name);

        // Be sure the taskpane.html has an element with Id = item-subject.
        const label = document.getElementById("item-subject");

        // Write file names to task pane and the console.
        const nameText = names.join(", ");
        if (label) label.textContent = nameText;
        console.log(nameText);
    } else {
        const errorText = await response.text();
        console.error("Microsoft Graph call failed - error text: " + errorText);
    }
}

async function setupNaa() {
    // Initialize the public client application
    // PublicClientNext.createPublicClientApplication
    publicClientApplication = await createNestablePublicClientApplication({
        auth: {
            // https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade
            // select App registration
            // look at the overview
            clientId: "e9d506f4-79d8-42b1-bc18-ebd16a23afab",
            authority: "https://login.microsoftonline.com/common",
        },
        system: {
            loggerOptions: {
                logLevel: LogLevel.Verbose,
                loggerCallback: (level: LogLevel, message: string) => {
                    switch (level) {
                        case LogLevel.Error:
                            console.error(message);
                            return;
                        case LogLevel.Info:
                            console.info(message);
                            return;
                        case LogLevel.Verbose:
                            console.debug(message);
                            return;
                        case LogLevel.Warning:
                            console.warn(message);
                            return;
                    }
                },
                piiLoggingEnabled: true,
            },
        },
    });

    testNaa();
}

export async function setupOffice() {
    // Calling Office.onReady after setup loads the UI faster.
    await Office.onReady(({ host, platform }) => {
        console.log(`Office is ready
Host: ${host}
Platform: ${platform}`);
        setHost(host);
        setPlatform(platform);

        setupNaa();
    });
}
