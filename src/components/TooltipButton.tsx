import React from "react";
import { ToolbarButton, Tooltip } from "@fluentui/react-components";

export function TooltipButton({
    id,
    tip,
    icon,
    onClick,
}: {
    id?: string;
    tip: string;
    icon: React.JSX.Element;
    onClick?: () => void;
}) {
    return (
        <Tooltip content={tip} relationship="label">
            <ToolbarButton id={id} aria-label={tip} icon={icon} onClick={onClick} />
        </Tooltip>
    );
}
