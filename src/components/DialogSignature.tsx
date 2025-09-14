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
    Link,
    Persona,
} from "@fluentui/react-components";

import { makeStyles, tokens } from "@fluentui/react-components";
import { LogTag, log } from "../core/log";
import { loc } from "../core/localize/loc";
import { getSnipDocText, SnipWithSource } from "../core/Snip";
import { uploadFileSig } from "../core/util/uploadFileSig";
import { TooltipButton } from "./TooltipButton";
import {
    AddRegular,
    ArrowDownloadRegular,
    ArrowSyncRegular,
    ArrowUploadRegular,
    CheckmarkRegular,
    LinkRegular,
    QuestionRegular,
    WarningRegular,
} from "@fluentui/react-icons";
import { downloadFileText } from "../core/util/downloadFileText";
import { getGitHubUser } from "../core/github/getGitHubUser";
import { pgpSignatureMatches } from "../core/pgp/pgpSignatureMatches";
import { getGitHubUserGpgKeys } from "../core/github/getGitHubUserGpgKeys";
import { debounceClear, debounce } from "../core/util/debounce";

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

/**
 * @returns author info if the snip is signed and the signature matches the public key of the author.
 * If the snip is not signed or the signature does not match, returns undefined.
 */
async function getSnipAuthor(snip: SnipWithSource): Promise<undefined | { username: string; avatar: string }> {
    const { author } = snip;
    if (author === undefined) {
        return undefined;
    }

    const { username, signature } = author;

    const user = await getGitHubUser(username);
    if (user === undefined) {
        return undefined;
    }
    const avatar = user.avatar_url;

    const messageText = getSnipDocText(snip);

    // public keys linked to the GitHub user
    const publicKey = await getGitHubUserGpgKeys(username);
    if (publicKey === undefined) {
        log(LogTag.UploadFile, `GitHub GPG key for user ${username} not found`);
        return undefined;
    }

    const matches = await pgpSignatureMatches({
        messageText,
        publicKeyArmored: publicKey,
        detachedSignature: signature,
    });

    if (!matches) {
        return undefined;
    }

    return {
        username,
        avatar,
    };
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

function getSigFileName(name: { name: string }) {
    return `${name}.sig`;
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

    // Signature
    const [authorName, setAuthorName] = React.useState<string | undefined>(undefined);
    const [authorAvatar, setAuthorAvatar] = React.useState<string | undefined>(undefined);

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

        // See if the snip has a valid author.
        getSnipAuthor(snip).then((authorInfo) => {
            if (authorInfo === undefined) {
                setAuthorName(undefined);
                setAuthorAvatar(undefined);
                return;
            }
            const { username, avatar } = authorInfo;
            setAuthorName(username);
            setAuthorAvatar(avatar);
        });
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

        const publicKey = await getGitHubUserGpgKeys(username);
        if (publicKey === undefined) {
            log(LogTag.UploadSignature, `GitHub GPG key for user ${username} not found`);
            setSignatureState("fail");
            return;
        }

        const matches = await pgpSignatureMatches({
            messageText: getSnipDocText(snip),
            publicKeyArmored: publicKey,
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
        if (signature === undefined) {
            log(LogTag.UploadFile, "No signature to add to snip");
            return;
        }

        const updatedSnip: SnipWithSource = {
            ...snip,
            author: {
                source: "GitHub",
                username,
                signature,
            },
        };
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
                            {authorName === undefined ? (
                                <p>Snip by unknown author.</p>
                            ) : (
                                <>
                                    <p>Snip Author</p>
                                    <Persona
                                        name={authorName}
                                        primaryText={authorName}
                                        secondaryText={
                                            <Link
                                                as="button"
                                                onClick={() =>
                                                    window.open(`https://www.github.com/${authorName}`, "_blank")
                                                }
                                            >
                                                GitHub
                                                <LinkRegular />
                                            </Link>
                                        }
                                        size="large"
                                        avatar={{
                                            image: {
                                                src: authorAvatar,
                                            },
                                        }}
                                    />
                                </>
                            )}
                            Create a new signature for the snip "{snip.name}"
                            <Label htmlFor={inputId}>GitHub Username</Label>
                            <Input
                                value={username}
                                onChange={(ev, data) => {
                                    setUsername(data.value.trim());
                                }}
                                id={inputId}
                                contentAfter={getBadgeForState(usernameState)}
                            />
                            <ol>
                                <li>
                                    <strong>Download the doc text</strong> to sign:
                                    <TooltipButton
                                        tip={loc("Download Doc")}
                                        icon={<ArrowDownloadRegular />}
                                        onClick={downloadDoc}
                                    />
                                </li>
                                <li>
                                    <strong>Sign the doc text</strong> with the GPG key associated with your GitHub
                                    account:
                                    <br></br>
                                    <code>cd ~/Downloads</code>
                                    <br></br>
                                    <code>
                                        gpg --output "{getSigFileName(snip)}" --detach-sig --armor "
                                        {getDocFileName(snip)}"
                                    </code>
                                </li>
                                <li>
                                    <strong>Upload the signature</strong>:
                                    <TooltipButton
                                        tip={loc("Upload Sig")}
                                        icon={<ArrowUploadRegular />}
                                        onClick={uploadSignature}
                                    />
                                    {getBadgeForState(signatureState)}
                                </li>
                                <li>
                                    <strong>Add signature</strong> to snip:
                                    <TooltipButton
                                        tip={loc("Update Snip")}
                                        icon={<AddRegular />}
                                        onClick={addSignatureToSnip}
                                    />
                                </li>
                            </ol>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="primary">{loc("Close")}</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
