export interface Snip {
    name: string;
    files: { [key: string]: SnipFile };
}

export interface SnipFile {
    content: string;
    language: string;
}
