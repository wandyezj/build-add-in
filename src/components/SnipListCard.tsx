import * as React from "react";
import { Button, Caption1, Text, makeStyles, tokens } from "@fluentui/react-components";
import { MoreHorizontal20Regular } from "@fluentui/react-icons";
import { Card, CardHeader } from "@fluentui/react-components";

const useStyles = makeStyles({
    card: {
        width: "360px",
        maxWidth: "100%",
        height: "fit-content",
    },

    caption: {
        color: tokens.colorNeutralForeground3,
    },
});

export function SnipListCard({
    title,
    modified,
    onClick,
}: {
    id: string;
    title: string;
    modified: number;
    onClick: () => void;
}) {
    const styles = useStyles();

    return (
        <Card className={styles.card} orientation="horizontal" onClick={onClick}>
            <CardHeader
                header={<Text weight="semibold">{title}</Text>}
                description={<Caption1 className={styles.caption}>{formatModified(modified)}</Caption1>}
                action={
                    <Button appearance="transparent" icon={<MoreHorizontal20Regular />} aria-label="More options" />
                }
            />
        </Card>
    );
}

function formatModified(modified: number): string {
    const now = Date.now();
    const delta = now - modified;

    const seconds = Math.floor(delta / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} ${days > 1 ? "days" : "day"} ago`;
    }

    if (hours > 0) {
        return `${hours} ${hours > 1 ? "hours" : "hour"} ago`;
    }

    if (minutes > 0) {
        return `${minutes} ${minutes > 1 ? "minutes" : "minute"} ago`;
    }

    if (seconds > 0) {
        return `${seconds} ${seconds > 1 ? "seconds" : "second"} ago`;
    }

    return "Just Edited";

    // const date = new Date(modified);

    // return date.toLocaleString();
}
