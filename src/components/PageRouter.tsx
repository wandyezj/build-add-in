import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Clock } from "./Pages/Clock";
import { PageLink } from "./Pages/PageLink";
import { PageEditor } from "./Pages/PageEditor";

export default function PageRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" key="/" element={<PageLink />} />
                <Route path="/clock" key="/clock" element={<Clock />} />
                <Route path="/link" key="/link" element={<PageLink />} />
                <Route path="/editor" key="/editor" element={<PageEditor />} />
            </Routes>
        </HashRouter>
    );
}
