import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Clock } from "./Pages/Clock";
import { PageLink } from "./Pages/PageLink";
import { PageEditorExample } from "./Pages/PageEditorExample";
import { PageEditor } from "./Pages/PageEditor";

export default function PageRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" key="/" element={<PageEditor />} />
                <Route path="/clock" key="/clock" element={<Clock />} />
                <Route path="/link" key="/link" element={<PageLink />} />
                <Route path="/editor-example" key="/editor-example" element={<PageEditorExample />} />
                <Route path="/editor" key="/editor" element={<PageEditor />} />
            </Routes>
        </HashRouter>
    );
}
