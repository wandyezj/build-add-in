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
module.exports = async (env, options) => {
    //console.log(env);

    // pass in parameters with --env analyze=true
    const analyze = env["analyze"] === "true";

    const isDevelopment = options.mode === "development";
    const config = {
        // no source maps for production
        devtool: isDevelopment ? "inline-source-map" : undefined,

        // Ignore file size violation hints
        performance: {
            hints: false,
        },
        devServer: {
            static: {
                directory: path.join(__dirname, "..", "dist"),
            },
        },
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
    if (options.mode === "development") {
        const options = await devCerts.getHttpsServerOptions();

        config.devServer = {
            ...config.devServer,
            open: optionDevOpenBrowserTabs ? optionOpenBrowserTabs : [],
            port: 3000,
            server: {
                type: "https",
                options,
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        };
    }

    return config;
};
