import React from "react";
import { Link } from "react-router-dom";

export function PageLink() {
    return (
        <div>
            <ul>
                <li>
                    <Link to="/">root</Link>
                </li>
                <li>
                    <Link to="/clock">clock</Link>
                </li>
                <li>
                    <Link to="/link">link</Link>
                </li>
                <li>
                    <Link to="/editor-example">editor-example</Link>
                </li>
                <li>
                    <Link to="/editor">editor</Link>
                </li>
            </ul>
        </div>
    );
}
