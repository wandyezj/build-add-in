import { globalLog } from "./server/globalLog";
import { parseArgs } from "node:util";
import { startServer, ServerConfig } from "./server/startServer";

const { values } = parseArgs({
    options: {
        port: {
            type: "string",
            short: "p",
        },
    },
    strict: false,
});

globalLog.log("Starting server...");

function gracefulShutdown() {
    globalLog.log("Shutdown signal received. Closing server...");
    process.exit(0);
}

// Ctrl + C
process.on("SIGINT", gracefulShutdown);

function getPort(portArg?: string): number | undefined {
    if (typeof portArg === "undefined") {
        return undefined;
    }

    if (typeof portArg === "string") {
        const parsedPort = parseInt(portArg, 10);
        if (!isNaN(parsedPort)) {
            // Ensure the port is within the valid range for dynamic/private ports
            if (parsedPort >= 1024 && parsedPort <= 49151) {
                return parsedPort;
            }
        }
    }

    return undefined;
}

const portArg = typeof values.port === "string" ? values.port : undefined;

const config: ServerConfig = {
    http: {
        port: getPort(portArg) || 3003,
    },
};

startServer(config);
