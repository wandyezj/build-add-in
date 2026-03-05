const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { Marked } = require("marked");

// Options

/**
 * In Dev mode, when starting, open the edit, run, and blocks in the browser
 */
const optionDevOpenBrowserTabs = true;
const optionOpenBrowserTabs = [
    //"/test.html",
    "/edit.html",
    //"/run.html",
    //"/settings.html",
    //"/blocks.html",
    //"/help.html"
];

/**
 * Removes the same amount of whitespace from the start of each line, based on the line with the least amount of leading whitespace.
 * @param {string} s - The input string.
 * @returns {string} - The string with the same amount of leading whitespace removed from each line.
 */
function dedent(s) {
    const text = s.replace(/\r\n/g, "\n");

    const lines = text.split("\n");

    let minIndent = lines.reduce((minIndent, line) => {
        if (line.trim() === "") {
            return minIndent;
        }

        const match = line.match(/^[ ]*/);
        const indent = match ? match[0].length : 0;
        return Math.min(minIndent, indent);
    }, Infinity);

    if (!Number.isFinite(minIndent) || minIndent === 0) {
        return text;
    }

    return lines.map((line) => (line.trim() === "" ? "" : line.slice(minIndent))).join("\n");
}

const marked = new Marked();
marked.use({
    gfm: true,
});

function mdToHtml(content, title) {
    const body = marked.parse(content.toString());
    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
</head>
<body>
${body}
</body>
</html>
`;
}

const devCerts = require("office-addin-dev-certs");

const path = require("path");
const { execSync } = require("child_process");
const { readdirSync, readFileSync, statSync } = require("fs");

/**
 * Gets a list of all files in the directory and its subdirectories.
 * @param {string} directory
 * @returns {string[]} A list of file paths.
 */
function getDirectoryFiles(directory) {
    const entries = readdirSync(directory, { withFileTypes: true });
    const files = [];

    entries.forEach((entry) => {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...getDirectoryFiles(fullPath));
            return;
        }

        files.push(fullPath);
    });

    return files;
}

/**
 * Detect if any files in the directory have changed.
 * @param {string} root - The root directory to check for changes.
 */
function getDirectoryHash(root) {
    const files = getDirectoryFiles(root).sort();

    const parts = files.map((filePath) => {
        const stat = statSync(filePath);
        const relativePath = path.relative(root, filePath);
        return `${relativePath}:${stat.size}:${stat.mtimeMs}`;
    });

    return parts.join("|");
}

/**
 * @typedef {Object} LibraryPattern
 * @property {string} watch - Directory to watch for changes, relative to project root. Changes trigger the command to run.
 * @property {string} from - Source directory, relative to project root.
 * @property {string} to - Output directory, relative to project root.
 * @property {(file: string) => boolean} filter - Returns true for files to include.
 * @property {(input: { name: string; content: string }) => { name: string; content: string }} transform - Transforms file name/content before emit.
 */

/**
 * The LibraryPlugin plugin runs a command to generate files.
 * Then copies files from specified directories to the output directory.
 */
class LibraryPlugin {
    /**
     * Run a command whenever files in the watch directory change, and copy files from the specified directories to the output directory.
     * @param {Object} options - Options for the plugin
     * @param {string} options.watch - Directory to watch for changes
     * @param {string} options.command - Command to run to generate files
     * @param {Array<LibraryPattern>} options.patterns - Patterns for copying files
     */
    constructor(options) {
        this.command = options.command;
        this.patterns = options.patterns;
        this.watch = options.watch;
        this.lastWatchHash = "";
    }

    apply(compiler) {
        compiler.hooks.thisCompilation.tap("LibraryPlugin", (compilation) => {
            const { sources } = compiler.webpack;
            compilation.hooks.processAssets.tap(
                {
                    name: "LibraryPlugin",
                    stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
                },
                () => {
                    function emitAsset(name, content) {
                        const source = new sources.RawSource(content);
                        compilation.emitAsset(name, source);
                    }

                    const root = path.resolve(__dirname, "..");

                    const watchHash = getDirectoryHash(path.join(root, this.watch));
                    const shouldRunCommand = !compiler.watchMode || this.lastWatchHash !== watchHash;

                    // Run the command to generate files
                    if (shouldRunCommand) {
                        try {
                            execSync(this.command, { cwd: root, stdio: "inherit" });
                        } catch (error) {
                            // Error running the command.
                            compilation.errors.push(new Error(`LibraryPlugin: Command failed - ${error.message}`));
                            return;
                        }

                        this.lastWatchHash = watchHash;
                    }

                    this.patterns.forEach(({ from, to, filter, transform }) => {
                        const fromPath = path.resolve(root, from);
                        const toRelativePath = to;

                        const files = readdirSync(fromPath).filter((file) => filter(file));

                        files.forEach((name) => {
                            const filePathIn = path.join(fromPath, name);
                            const contentIn = readFileSync(filePathIn, "utf-8");
                            const { name: nameOut, content: contentOut } = transform({ name, content: contentIn });
                            const filePathOut = path.posix.join(toRelativePath, nameOut);
                            emitAsset(filePathOut, contentOut);
                        });
                    });
                }
            );
        });
    }
}

module.exports = async (env, options) => {
    //console.log(env);

    // pass in parameters with --env analyze=true
    const analyze = env["analyze"] === "true";

    const isDevelopment = options.mode === "development";

    const ignored = ["**/temp/**", "**/dist/**"];
    const watchOptions = {
        ignored,
    };

    const config = {
        name: "main",
        // no source maps for production
        devtool: isDevelopment ? "inline-source-map" : undefined,

        // Ignore file size violation hints
        performance: {
            hints: false,
        },
        devServer: {
            static: {
                directory: path.join(__dirname, "..", "dist"),
                watch: {
                    ignored,
                },
            },
        },
        watchOptions,
        entry: {
            edit: "./src/edit.tsx",
            run: "./src/run.ts",
            help: "./src/help.tsx",
            actions: "./src/actions.ts",
            settings: "./src/settings.tsx",
            blocks: "./src/blocks.tsx",
            test: "./src/test.ts",
            shared: "./src/shared.tsx",
        },
        output: {
            // Add contenthash to cache bust on CDN
            // filename: (pathData) => {
            //     const name = pathData.chunk?.name;
            //     if (name === "library") {
            //         return "library/build.js";
            //     }

            //     return isDevelopment ? "[name].bundle.js" : "[name].bundle-[contenthash].js";
            // },
            filename: isDevelopment ? "[name].bundle.js" : "[name].bundle-[contenthash].js",
            path: path.resolve(__dirname, "..", "dist"),
        },
        optimization: {
            runtimeChunk: "single",
            splitChunks: {
                chunks: "all",
            },
        },
        resolve: {
            extensions: [".ts", ".json", ".js", ".tsx"],
        },

        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: "assets/resource",
                },
                {
                    test: /\.(ts|tsx)$/,
                    loader: "ts-loader",
                },
            ],
            noParse: [require.resolve("typescript/lib/typescript.js")],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: "src/blocks.html",
                filename: "blocks.html",
                chunks: ["blocks"],
            }),
            new HtmlWebpackPlugin({
                template: "src/edit.html",
                filename: "edit.html",
                chunks: ["edit"],
            }),
            new HtmlWebpackPlugin({
                template: "src/run.html",
                filename: "run.html",
                chunks: ["run"],
            }),
            new HtmlWebpackPlugin({
                template: "src/help.html",
                filename: "help.html",
                chunks: ["help"],
            }),
            new HtmlWebpackPlugin({
                template: "src/actions.html",
                filename: "actions.html",
                chunks: ["actions"],
            }),
            new HtmlWebpackPlugin({
                template: "src/settings.html",
                filename: "settings.html",
                chunks: ["settings"],
            }),
            new HtmlWebpackPlugin({
                template: "src/test.html",
                filename: "test.html",
                chunks: ["test"],
            }),
            new HtmlWebpackPlugin({
                template: "src/shared.html",
                filename: "shared.html",
                chunks: ["shared"],
            }),
            new MonacoWebpackPlugin({
                languages: [
                    "typescript",
                    "css",
                    "html",
                    //"javascript",
                    //"markdown",
                    //"json", "yaml",
                    //"plaintext",
                ],
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "./src/index.html",
                        to: "index.html",
                    },
                    {
                        from: "./src/*.css",
                        to: "[name].css",
                    },
                    {
                        from: "./src/robots.txt",
                        to: "robots.txt",
                    },
                    { from: "assets/*.png", to: "" },
                    {
                        from: "./src/shortcuts.json",
                        to: "shortcuts.json",
                    },
                    {
                        from: "statements/*.md",
                        to: "statements/[name].html",
                        transform: (content, absoluteFilename) => {
                            return mdToHtml(content, path.basename(absoluteFilename, ".md"));
                        },
                    },
                    {
                        from: "manifests/production.*",
                        to: "manifests/[name][ext]",
                    },
                ],
            }),
        ],
    };

    if (analyze) {
        config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: "static", openAnalyzer: true }));
    }

    //Only need to configure webserver in development mode
    if (isDevelopment) {
        config.devServer = {
            ...config.devServer,
            open: optionDevOpenBrowserTabs ? optionOpenBrowserTabs : [],
            port: 3000,
            server: {
                type: "https",
                options: await getHttpsOptions(),
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        };
    }

    const libraryConfig = {
        dependencies: ["main"],
        watchOptions,
        name: "library",
        entry: {
            library: "./lib/index.ts",
        },
        output: {
            filename: "library/build.js",
            path: path.resolve(__dirname, "..", "dist"),
            library: {
                // Expose the library on the global object as "Build"
                name: "Build",
                type: "global",
            },
        },
        optimization: {
            runtimeChunk: false,
            splitChunks: false,
            minimize: false, // Disable minimization for library
        },
        resolve: {
            extensions: [".ts", ".json", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.(ts)$/,
                    loader: "ts-loader",
                    options: {
                        configFile: path.resolve(__dirname, "..", "lib", "tsconfig.json"),
                    },
                },
            ],
        },
        plugins: [
            new LibraryPlugin({
                command: "npm run doc",
                // Watch the lib directory, this should contain all lib source files.
                watch: "lib",
                patterns: [
                    {
                        from: "temp/library-rollup",
                        filter: (file) => file.endsWith(".d.ts"),
                        to: "library",
                        transform: ({ name, content }) => {
                            // Remove export { } from the rollup file
                            const replacements = [
                                ["export { }", ""],
                                ["export declare", ""],
                            ];

                            content = replacements.reduce((content, [search, replace]) => {
                                return content.replaceAll(search, replace);
                            }, content);

                            // Embed in namespace
                            content =
                                dedent(`
                                    /**
                                     * The Build namespace contains all public APIs of the library.
                                     * @beta
                                     */
                                    declare namespace Build {
                                    `) + `${content}\n}`;

                            return { name, content };
                        },
                    },
                    {
                        from: "temp/library-markdown",
                        filter: (file) => file.endsWith(".md"),
                        to: "library",
                        transform: ({ name, content }) => {
                            // Convert markdown to HTML
                            const basename = path.basename(name, ".md");

                            // Fix links in markdown to point to HTML files
                            content = content.replaceAll(".md)", ".html)");

                            // Convert markdown to HTML
                            content = mdToHtml(content, basename);
                            return { name: `${basename}.html`, content };
                        },
                    },
                ],
            }),
        ],
    };

    return [config, libraryConfig];
};

async function getHttpsOptions() {
    const options = await devCerts.getHttpsServerOptions();
    return options;
}
