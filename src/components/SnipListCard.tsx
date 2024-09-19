import * as React from "react";
import { Caption1, Text, makeStyles, tokens } from "@fluentui/react-components";
import { Card, CardHeader } from "@fluentui/react-components";
import { formatModified } from "../core/util/formatModified";

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
    id,
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
        <Card id={id} className={styles.card} orientation="horizontal" onClick={onClick}>
            <CardHeader
                header={<Text weight="semibold">{title}</Text>}
                description={<Caption1 className={styles.caption}>{formatModified(modified)}</Caption1>}
                // action={
                //     <Button appearance="transparent" icon={<MoreHorizontal20Regular />} aria-label="More options" />
                // }
            />
        </Card>
    );
}
