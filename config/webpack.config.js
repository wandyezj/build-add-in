const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
//const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { Marked } = require("marked");
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
        },
        output: {
            // Add contenthash to cache bust on CDN
            filename: isDevelopment ? "[name].bundle.js" : "[name].bundle-[contenthash].js",
            path: path.resolve(__dirname, "..", "dist"),
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
            //new BundleAnalyzerPlugin(),
            new CleanWebpackPlugin(),
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
                        to: "index.html",
                        from: "./src/index.html",
                    },
                    {
                        to: "edit.css",
                        from: "./src/edit.css",
                    },
                    {
                        to: "robots.txt",
                        from: "./src/robots.txt",
                    },
                    { from: "assets/*.png", to: "" },
                    {
                        from: "statements/*.md",
                        to: "statements/[name].html",
                        transform: (content, absoluteFilename) => {
                            return mdToHtml(content, path.basename(absoluteFilename, ".md"));
                        },
                    },
                ],
            }),
        ],
    };

    //Only need to configure webserver in development mode
    if (options.mode === "development") {
        config.devServer = {
            ...config.devServer,
            open: ["/edit.html", "/run.html"],
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

    return config;
};

async function getHttpsOptions() {
    const options = await devCerts.getHttpsServerOptions();
    return options;
}
