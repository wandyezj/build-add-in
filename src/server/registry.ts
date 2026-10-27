import { getMatcher } from "./getMatcher";
import { FunctionRequestMatcher, FunctionRequestHandler } from "./handleRequest";
import { getServeFile } from "./handlers/getServeFile";

export function getFile(filePath: string, contentType: string): [FunctionRequestMatcher, FunctionRequestHandler] {
    return [getMatcher({ method: "GET", url: `/${filePath}` }), getServeFile(filePath, contentType)];
}

export const registry: [FunctionRequestMatcher, FunctionRequestHandler][] = [
    // Connectivity check
    [
        getMatcher({ method: "GET", url: "/" }),
        async (request, response) => {
            response.writeHead(200, [["Content-Type", "text/plain"]]);
            response.write("");
            response.end();
        },
    ],

    // Ping
    [
        getMatcher({ method: "GET", url: "/ping" }),
        async (request, response) => {
            response.writeHead(200, [["Content-Type", "text/plain"]]);
            response.write("pong");
            response.end();
        },
    ],

    // Command
    [
        getMatcher({ method: "POST", url: "/run-command" }),
        async (request, response) => {
            response.writeHead(200, [["Content-Type", "text/plain"]]);
            response.write("command received");
            response.end();
        },
    ],
];
