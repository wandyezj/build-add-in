//
// Parse out the different types of libraries from the libraries list
//

export type LibType = "css" | "js" | undefined;

export function parseLibraries(libraries: string) {
    const libs = libraries
        .split("\n")
        .map((lib) => lib.trim())
        .filter((lib) => lib !== "")
        .map((lib) => {
            let libType: LibType = undefined;
            const isLink = lib.startsWith("http://") || lib.startsWith("https://");
            if (isLink) {
                if (lib.endsWith(".css")) {
                    libType = "css";
                } else if (lib.endsWith(".js")) {
                    libType = "js";
                }
            }

            return {
                lib,
                libType,
            };
        });

    const js = libs.filter(({ libType }) => libType === "js").map(({ lib }) => lib);
    const css = libs.filter(({ libType }) => libType === "css").map(({ lib }) => lib);
    return { js, css };
}
