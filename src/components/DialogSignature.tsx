import React, { useEffect } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent,
    Button,
    Label,
    Input,
    useId,
    Badge,
} from "@fluentui/react-components";

import { makeStyles, tokens } from "@fluentui/react-components";
import { LogTag, log } from "../core/log";
import { loc } from "../core/localize/loc";
import { getSnipDocText, SnipWithSource } from "../core/Snip";
import { uploadFileSig } from "../core/util/uploadFileSig";
import { TooltipButton } from "./TooltipButton";
import {
    ArrowDownloadRegular,
    ArrowSyncRegular,
    ArrowUploadRegular,
    CheckmarkRegular,
    QuestionRegular,
    WarningRegular,
} from "@fluentui/react-icons";
import { downloadFileText } from "../core/util/downloadFileText";
import { getGitHubUser } from "../core/github/getGitHubUser";
import { pgpSignatureMatches } from "../core/pgp/pgpSignatureMatches";
import { debounceClear, debounce } from "../core/util/debounce";
import { SnipAuthor } from "./SnipAuthor";
import { getGitHubUserGpgKeysRaw } from "../core/github/getGitHubUserGpgKeysRaw";

const useStyles = makeStyles({
    base: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        marginBottom: tokens.spacingVerticalMNudge,
    },
});

function getBadgeForState(state: "none" | "query" | "success" | "fail") {
    switch (state) {
        default:
        case "none":
            return <Badge size="large" color="informative" icon={<QuestionRegular />} />;
        case "query":
            return <Badge size="large" color="informative" icon={<ArrowSyncRegular />} />;
        case "success":
            return <Badge size="large" color="success" icon={<CheckmarkRegular />} />;
        case "fail":
            return <Badge size="large" color="warning" icon={<WarningRegular />} />;
    }
}

async function isGitHubUsername(username: string): Promise<boolean> {
    if (username.trim().length === 0) {
        return false;
    }
    const user = await getGitHubUser(username);
    const exists = user !== undefined;
    return exists;
}

function getDocFileName({ name }: { name: string }) {
    return `${name}.txt`;
}

function getSigFileName({ name }: { name: string }) {
    return `${name}.sig`;
}

function snipWithAuthor(
    snip: SnipWithSource,
    author: { source: "GitHub"; username: string; signature: string }
): SnipWithSource {
    return {
        ...snip,
        author,
    };
}

export function DialogSignature({
    open,
    setOpen,
    snip,
    updateSnip,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    snip: SnipWithSource;
    updateSnip: (updatedSnip: SnipWithSource) => void;
}) {
    const styles = useStyles();

    const inputId = useId("input");

    const [username, setUsername] = React.useState("");
    const [usernameState, setUsernameState] = React.useState<"none" | "query" | "success" | "fail">("none");

    const [signature, setSignature] = React.useState<string | undefined>(undefined);
    const [signatureState, setSignatureState] = React.useState<"none" | "query" | "success" | "fail">("none");

    const [newSignatureOk, setNewSignatureOk] = React.useState<boolean>(false);

    useEffect(() => {
        // Reset when the dialog opens
        setNewSignatureOk(signatureState === "success");
    }, [signatureState]);

    async function updateUsernameState(username: string) {
        const debounceIdUsernameState = "usernameState";
        if (username.length === 0) {
            setUsernameState("none");
            debounceClear(debounceIdUsernameState);
        } else {
            setUsernameState("query");
            debounce(debounceIdUsernameState, 1000, async () => {
                const exists = await isGitHubUsername(username);

                if (exists) {
                    setUsernameState("success");
                } else {
                    setUsernameState("fail");
                    log(LogTag.UploadFile, `GitHub user ${username} not found`);
                }
            });
        }
    }

    useEffect(() => {
        updateUsernameState(username);
    }, [username]);

    useEffect(() => {
        // Reset when the dialog opens
        const username = snip.author?.username ?? "";

        setUsername(username);
        setSignature(undefined);
        setSignatureState("none");
    }, [open]);

    function downloadDoc() {
        const text = getSnipDocText(snip);
        const name = getDocFileName(snip);
        downloadFileText(text, name);
    }

    async function uploadSignature() {
        const signatureUploaded = await uploadFileSig();
        if (signatureUploaded === undefined) {
            return;
        }
        setSignature(undefined);
        setSignatureState("query");

        const publicKeys = await getGitHubUserGpgKeysRaw(username);
        if (publicKeys === undefined) {
            log(LogTag.UploadSignature, `GitHub GPG key for user ${username} not found`);
            setSignatureState("fail");
            return;
        }

        const { matches } = await pgpSignatureMatches({
            messageText: getSnipDocText(snip),
            publicKeysArmored: publicKeys,
            detachedSignature: signatureUploaded,
        });

        if (matches) {
            log(LogTag.UploadSignature, `Signature matches for user ${username}`);
            setSignatureState("success");
            setSignature(signatureUploaded);
        } else {
            log(LogTag.UploadSignature, `Signature does not match for user ${username}`);
            setSignatureState("fail");
        }
    }

    async function addSignatureToSnip() {
        console.log("Add signature to snip");
        if (signature === undefined) {
            log(LogTag.UploadFile, "No signature to add to snip");
            return;
        }

        const updatedSnip = snipWithAuthor(snip, {
            source: "GitHub",
            username,
            signature,
        });
        updateSnip(updatedSnip);
    }

    return (
        <Dialog
            // this controls the dialog open state
            open={open}
            onOpenChange={(event, data) => {
                // it is the users responsibility to react accordingly to the open state change
                setOpen(data.open);
            }}
        >
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{loc("Signature")}</DialogTitle>
                    <DialogContent>
                        <div className={styles.base}>
                            Create a new signature for the snip "{snip.name}"
                            <ol>
                                <li>
                                    <Label htmlFor={inputId}>{loc("GitHub Username")}</Label>
                                    <Input
                                        value={username}
                                        onChange={(ev, data) => {
                                            setUsername(data.value.trim());
                                        }}
                                        id={inputId}
                                        contentAfter={getBadgeForState(usernameState)}
                                    />
                                </li>
                                <li>
                                    <strong>{loc("Download the doc text to sign:")}</strong>
                                    <TooltipButton
                                        tip={loc("Download Doc")}
                                        icon={<ArrowDownloadRegular />}
                                        onClick={downloadDoc}
                                    />
                                </li>
                                <li>
                                    <strong>{loc("Sign the doc text")}</strong>{" "}
                                    {loc("with the GPG key associated with your GitHub account:")}
                                    <br></br>
                                    <code>cd ~/Downloads</code>
                                    <br></br>
                                    <code>
                                        gpg --output "{getSigFileName(snip)}" --detach-sig --armor "
                                        {getDocFileName(snip)}"
                                    </code>
                                </li>
                                <li>
                                    <strong>{loc("Upload the signature")}</strong>:
                                    <TooltipButton
                                        tip={loc("Upload Sig")}
                                        icon={<ArrowUploadRegular />}
                                        onClick={uploadSignature}
                                    />
                                    {getBadgeForState(signatureState)}
                                </li>
                                <li>
                                    <strong>{loc("Check the signature")}</strong>:<br></br>
                                    {username !== undefined && signature !== undefined ? (
                                        <SnipAuthor
                                            snip={snipWithAuthor(snip, { source: "GitHub", username, signature })}
                                        />
                                    ) : (
                                        <>
                                            <p>{loc("No signature uploaded")}</p>
                                        </>
                                    )}
                                </li>
                            </ol>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance={newSignatureOk ? "secondary" : "primary"}>{loc("Close")}</Button>
                        </DialogTrigger>
                        {newSignatureOk ? (
                            <DialogTrigger disableButtonEnhancement>
                                <Button onClick={addSignatureToSnip} appearance="primary">
                                    {loc("Sign")}
                                </Button>
                            </DialogTrigger>
                        ) : (
                            <> </>
                        )}
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
