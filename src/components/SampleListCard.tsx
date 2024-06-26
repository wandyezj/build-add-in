import * as React from "react";
import { Caption1, Text, makeStyles, tokens } from "@fluentui/react-components";
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
        <Card className={styles.card} orientation="vertical" onClick={onClick}>
            <CardHeader
                header={<Text weight="semibold">{title}</Text>}
                description={<Caption1 className={styles.caption}>{description}</Caption1>}
            />
        </Card>
    );
}
