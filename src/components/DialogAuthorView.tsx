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
    Link,
    Persona,
} from "@fluentui/react-components";

import { makeStyles, tokens } from "@fluentui/react-components";
import { SnipWithSource } from "../core/Snip";
import { loc } from "../core/localize/loc";
import { LinkRegular } from "@fluentui/react-icons";
import { getSnipAuthor } from "../core/getSnipAuthor";

const useStyles = makeStyles({
    base: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        marginBottom: tokens.spacingVerticalMNudge,
    },
});

export function DialogAuthorView({
    open,
    setOpen,
    snip,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    snip: SnipWithSource;
}) {
    const styles = useStyles();

    const [authorName, setAuthorName] = React.useState<string | undefined>(undefined);
    const [authorAvatar, setAuthorAvatar] = React.useState<string | undefined>(undefined);

    useEffect(() => {
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
                    <DialogTitle>{loc("Author")}</DialogTitle>
                    <DialogContent>
                        <div className={styles.base}>
                            {authorName === undefined ? (
                                <p>Snip by unknown author.</p>
                            ) : (
                                <>
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
                                        size="extra-large"
                                        avatar={{
                                            image: {
                                                src: authorAvatar,
                                            },
                                        }}
                                    />
                                </>
                            )}
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
