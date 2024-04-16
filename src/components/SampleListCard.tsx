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

export function SampleListCard({
    title,
    description,
    onClick,
}: {
    id: string;
    title: string;
    description: string;
    onClick: () => void;
}) {
    const styles = useStyles();

    return (
        <Card className={styles.card} orientation="horizontal" onClick={onClick}>
            <CardHeader
                header={<Text weight="semibold">{title}</Text>}
                description={<Caption1 className={styles.caption}>{""}</Caption1>}
                action={
                    <Button appearance="transparent" icon={<MoreHorizontal20Regular />} aria-label="More options" />
                }
            />
        </Card>
    );
}
