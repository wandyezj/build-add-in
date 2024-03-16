import * as React from "react";
import { Button, Caption1, Text, makeStyles, tokens } from "@fluentui/react-components";
import { MoreHorizontal20Regular } from "@fluentui/react-icons";
import { Card, CardHeader, CardPreview } from "@fluentui/react-components";

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

export function SnipListCard() {
    const styles = useStyles();
    return (
        <Card className={styles.card} orientation="horizontal">
            <CardHeader
                header={<Text weight="semibold">App Name</Text>}
                description={<Caption1 className={styles.caption}>Developer</Caption1>}
                action={
                    <Button appearance="transparent" icon={<MoreHorizontal20Regular />} aria-label="More options" />
                }
            />
        </Card>
    );
}
