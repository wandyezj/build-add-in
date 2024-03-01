import React from "react";
import { ToolbarButton, Tooltip } from "@fluentui/react-components";

export function TooltipButton({ tip, icon }: { tip: string; icon: React.JSX.Element }) {
    return (
        <Tooltip content={tip} relationship="label">
            <ToolbarButton aria-label={tip} appearance="primary" icon={icon} />
        </Tooltip>
    );
}
