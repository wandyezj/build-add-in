import React, { useEffect } from "react";
import { Link, Persona, Tooltip } from "@fluentui/react-components";
import { LinkRegular } from "@fluentui/react-icons";
import { getSnipAuthor } from "../core/getSnipAuthor";
import { SnipWithSource } from "../core/Snip";
import { loc } from "../core/localize/loc";

/**
 * The author information for a snip.
 */
export function SnipAuthor({ snip }: { snip: SnipWithSource }) {
    const [authorName, setAuthorName] = React.useState<string | undefined>(undefined);
    const [authorAvatar, setAuthorAvatar] = React.useState<string | undefined>(undefined);
    const [userIds, setUserIds] = React.useState<string[] | undefined>(undefined);

    useEffect(() => {
        // See if the snip has a valid author.
        getSnipAuthor(snip).then((authorInfo) => {
            if (authorInfo === undefined) {
                setAuthorName(undefined);
                setAuthorAvatar(undefined);
                setUserIds(undefined);
                return;
            }
            const { username, avatar, userIds } = authorInfo;
            setAuthorName(username);
            setAuthorAvatar(avatar);
            setUserIds(userIds);
        });
    }, [snip]);

    if (authorName === undefined) {
        return <p>{loc("Unknown")}</p>;
    }

    return (
        <>
            <Persona
                name={authorName}
                primaryText={
                    <Tooltip content={userIds?.join(", ") || ""} relationship={"description"}>
                        <span>{authorName}</span>
                    </Tooltip>
                }
                secondaryText={
                    <span>
                        <Link as="button" onClick={() => window.open(`https://www.github.com/${authorName}`, "_blank")}>
                            GitHub
                            <LinkRegular />
                        </Link>
                    </span>
                }
                size="extra-large"
                avatar={{
                    image: {
                        src: authorAvatar,
                    },
                }}
            />
        </>
    );
}
