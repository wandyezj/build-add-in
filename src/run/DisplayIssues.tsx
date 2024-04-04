import React from "react";
import { Issue } from "../core/compileCode";

export function DisplayIssues({ issues }: { issues: Issue[] }) {
    const list = issues.map(({ message }, index) => <p key={index}>{message}</p>);

    return <> {list} </>;
}
