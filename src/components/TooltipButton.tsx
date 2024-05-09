import React from "react";
import { ToolbarButton, Tooltip } from "@fluentui/react-components";
import { TestId } from "./id";

export function TooltipButton({
    testId,
    id,
    tip,
    icon,
    onClick,
}: {
    testId?: TestId;
    id?: string;
    tip: string;
    icon: React.JSX.Element;
    onClick?: () => void;
}) {
    return (
        <Tooltip content={tip} relationship="label">
            <ToolbarButton data-testid={testId} id={id} aria-label={tip} icon={icon} onClick={onClick} />
        </Tooltip>
    );
}
