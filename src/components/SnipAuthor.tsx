import React, { useEffect } from "react";
import { Link, Persona } from "@fluentui/react-components";
import { LinkRegular } from "@fluentui/react-icons";
import { getSnipAuthor } from "../core/getSnipAuthor";
import { SnipWithSource } from "../core/Snip";

/**
 * The author information for a snip.
 */
export function SnipAuthor({ snip }: { snip: SnipWithSource }) {
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
    }, [snip]);

    if (authorName === undefined) {
        return <p>Unknown</p>;
    }

    return (
        <>
            <Persona
                name={authorName}
                primaryText={authorName}
                secondaryText={
                    <Link as="button" onClick={() => window.open(`https://www.github.com/${authorName}`, "_blank")}>
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
    );
}
