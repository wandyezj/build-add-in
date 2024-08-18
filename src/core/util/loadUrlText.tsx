export async function loadUrlText(url: string): Promise<string> {
    const request = await fetch(url);
    const text = await request.text();
    return text;
}
