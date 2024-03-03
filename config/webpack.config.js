const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const devCerts = require("office-addin-dev-certs");

const path = require("path");

module.exports = async (env, options) => {
    const isDevelopment = options.mode === "development";
    const config = {
        // no source maps for production
        devtool: isDevelopment ? "inline-source-map" : undefined,
        devServer: {
            static: {
                directory: path.join(__dirname, "..", "dist"),
            },
        },
        entry: {
            index: "./src/index.tsx",
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
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: "src/index.html",
                chunks: ["index"],
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
                        to: "index.css",
                        from: "./src/index.css",
                    },
                    {
                        to: "robots.txt",
                        from: "./src/robots.txt",
                    },
                    { from: "assets/*.png", to: "" },
                ],
            }),
        ],
    };

    // Only need to configure webserver in development mode
    if (options.mode === "development") {
        config.devServer = {
            ...config.devServer,
            server: "https",

            port: 8080,
            server: {
                type: "https",
                options: getHttpsOptions(),
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
