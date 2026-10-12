import { globalLog } from "./server/globalLog";
import { parseArgs } from "node:util";
import { startServer, ServerConfig } from "./server/startServer";
import { defaultHttpPort } from "./server/defaults";

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
            const portMinimum = 1024;
            const portMaximum = 49151;
            // Ensure the port is within the valid range for dynamic/private ports
            if (parsedPort >= portMinimum && parsedPort <= portMaximum) {
                return parsedPort;
            }
        }
    }

    return undefined;
}

const portArg = typeof values.port === "string" ? values.port : undefined;

const config: ServerConfig = {
    http: {
        port: getPort(portArg) || defaultHttpPort,
    },
};

startServer(config);
