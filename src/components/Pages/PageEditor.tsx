import React, { useEffect, useRef } from "react";
import * as monaco from 'monaco-editor';

export function PageEditor() {
    return (
        <Editor />
    );
}

export function Editor() {
	const divEl = useRef<HTMLDivElement>(null);
	let editor: monaco.editor.IStandaloneCodeEditor;
	useEffect(() => {
		if (divEl.current) {
			editor = monaco.editor.create(divEl.current, {
				value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
				language: 'typescript'
			});
		}
		return () => {
			editor.dispose();
		};
	}, []);
	return <div className="Editor" ref={divEl}></div>;
};