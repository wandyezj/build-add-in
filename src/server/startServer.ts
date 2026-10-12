import * as http from "http";
import * as https from "https";
import * as fs from "node:fs";
import * as path from "node:path";
import { globalLog } from "./globalLog";
import { handleRequest } from "./handleRequest";
import { registry } from "./registry";

export interface ServerConfig {
    http?: {
        port: number | string;
    };
    https?: {
        port: number | string;
    };
}

let requestCount = 0;

async function handleRequestGeneral(request: http.IncomingMessage, response: http.ServerResponse) {
    const method = request.method;
    const url = request.url;
    const origin = request.headers.origin;

    globalLog.log(`Request Received: [${requestCount++}]: from ${origin} ${method} ${url}`, {
        indent: 0,
    });
    globalLog.indent();
    try {
        await handleRequest(registry, request, response);
    } catch (error) {
        globalLog.error(`Error handling request: ${error}`, { indent: 0 });
        response.writeHead(500, [["Content-Type", "text/plain"]]);
        response.write("Internal Server Error");
        response.end();
    }
    globalLog.outdent();
}

/**
 * Start the http, https, and websocket servers described by the given config.
 */
export function startServer(config: ServerConfig) {
    //
    // Server Setup - http
    //

    if (config.http) {
        const serverHttp = http.createServer(handleRequestGeneral);

        const portHttp = config.http.port;

        globalLog.log(`Server [HTTP] is listening on port ${portHttp}`, { indent: 0 });

        serverHttp.listen(portHttp);
    }

    //
    // Server Setup - https
    //

    if (config.https) {
        // SSL/TLS Credentials
        const certDirectory = path.join(__dirname, "certs");
        const privateKey = fs.readFileSync(path.join(certDirectory, "key.pem"), "utf8");
        const certificate = fs.readFileSync(path.join(certDirectory, "cert.pem"), "utf8");
        const credentials = { key: privateKey, cert: certificate };

        // Create the HTTPS server
        const serverHttps = https.createServer(credentials, handleRequestGeneral);

        const portHttps = config.https.port;

        globalLog.log(`Server [HTTPS] is listening on port ${portHttps}`, { indent: 0 });

        serverHttps.listen(portHttps);
    }
}
