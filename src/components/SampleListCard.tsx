import * as React from "react";
import { Caption1, Link, Text, makeStyles, tokens } from "@fluentui/react-components";
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
    id,
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
        <Card id={id} className={styles.card} orientation="vertical" onClick={onClick}>
            <CardHeader
                header={<Text weight="semibold">{title}</Text>}
                description={<Caption1 className={styles.caption}>{description}</Caption1>}
            />
        </Card>
    );
}

export function GistListCard({
    id,
    title,
    description,
    link,
    onClick,
}: {
    id: string;
    title: string;
    description: string;
    link: string;
    onClick: () => void;
}) {
    const styles = useStyles();

    return (
        <Card id={id} className={styles.card} orientation="vertical" onClick={onClick}>
            <CardHeader
                header={<Text weight="semibold">{title}</Text>}
                description={
                    <Caption1 className={styles.caption}>
                        <Link href={link} target="_blank">
                            {description}
                        </Link>
                    </Caption1>
                }
            />
        </Card>
    );
}
