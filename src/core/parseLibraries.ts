//
// Parse out the different types of libraries from the libraries list
//

/**
 * css - link to css file
 * js - link to js file
 * dts - link to dts file
 */
export type LibType = "css" | "js" | "dts" | undefined;

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
                } else if (lib.endsWith(".d.ts")) {
                    libType = "dts";
                }
            }

            return {
                lib,
                libType,
            };
        });

    function getLibType(type: LibType) {
        return libs.filter(({ libType }) => libType === type).map(({ lib }) => lib);
    }

    const js = getLibType("js");
    const css = getLibType("css");
    const dts = getLibType("dts");

    return { js, css, dts };
}
