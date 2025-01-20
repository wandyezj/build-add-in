export function uploadFileJson(): Promise<string> {
    return new Promise((resolve) => {
        console.log("uploadFileJson");
        const element = document.createElement("input");
        element.setAttribute("type", "file");
        element.setAttribute("accept", ".json");
        element.onchange = async (ev) => {
            const target = ev.target as HTMLInputElement;

            const files = target.files || [];

            if (files.length !== 1) {
                console.error(`can only load a single file`);
                return;
            }

            const file = files[0];
            const name = file.name;
            console.log(`uploaded ${name}`);
            const text = await file.text();
            //console.log(text);
            resolve(text);
        };

        element.click();
    });
}
