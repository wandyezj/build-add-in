import React from "react";
import { Link } from "@fluentui/react-components";

export function ButtonLink({ text, url }: { text: string; url: string }) {
    function onClickTutorial() {
        window.open(url, "_blank");
    }

    return (
        <Link onClick={onClickTutorial} as="button">
            {text}
        </Link>
    );
}
