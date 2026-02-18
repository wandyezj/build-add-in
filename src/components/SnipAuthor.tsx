import React, { useEffect } from "react";
import { Link, Persona, Tooltip } from "@fluentui/react-components";
import { LinkRegular } from "@fluentui/react-icons";
import { getSnipAuthor, SnipAuthorResultCode } from "../core/getSnipAuthor";
import { SnipWithSource } from "../core/Snip";
import { loc } from "../core/localize/loc";

/**
 * The author information for a snip.
 */
export function SnipAuthor({ snip }: { snip: SnipWithSource }) {
    const [authorName, setAuthorName] = React.useState<string | undefined>(undefined);
    const [authorAvatar, setAuthorAvatar] = React.useState<string | undefined>(undefined);
    const [userIds, setUserIds] = React.useState<string[] | undefined>(undefined);
    const [authorResultCode, setAuthorResultCode] = React.useState<SnipAuthorResultCode | undefined>(undefined);

    useEffect(() => {
        // See if the snip has a valid author.
        getSnipAuthor(snip).then((authorInfo) => {
            const { result } = authorInfo;
            setAuthorResultCode(result);

            if (result === SnipAuthorResultCode.Verified) {
                const { username, avatar, userIds } = authorInfo.author;
                setAuthorName(username);
                setAuthorAvatar(avatar);
                setUserIds(userIds);
                return;
            }

            setAuthorName(undefined);
            setAuthorAvatar(undefined);
            setUserIds(undefined);
        });
    }, [snip]);

    if (authorName === undefined) {
        const reason = formatAuthorResultCode(authorResultCode);
        return (
            <div>
                <p>
                    <strong>{loc("Unknown")}</strong>
                </p>
                {reason === undefined ? null : <p>{reason}</p>}
            </div>
        );
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
                            GitHub {/* localize-scan-ignore: brand name */}
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

function formatAuthorResultCode(code: SnipAuthorResultCode | undefined): string {
    if (code === undefined) {
        return "";
    }

    switch (code) {
        case SnipAuthorResultCode.NoSignature:
            return loc("No signature.");
        case SnipAuthorResultCode.InvalidSignature:
            return loc("Signature is invalid.");
        default:
            return loc("Signature could not be verified.");
    }
}
