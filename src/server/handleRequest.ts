import * as http from "http";
import { globalLog } from "./globalLog";

export type FunctionRequestMatcher = (request: http.IncomingMessage) => boolean;

export type FunctionRequestHandler = (request: http.IncomingMessage, response: http.ServerResponse) => Promise<void>;

export async function handleRequest(
    registry: readonly (readonly [FunctionRequestMatcher, FunctionRequestHandler])[],
    request: http.IncomingMessage,
    response: http.ServerResponse
) {
    for (const [matcher, handler] of registry) {
        if (matcher(request)) {
            globalLog.log(`Request Matched: ${request.method} ${request.url}`, { indent: 0 });
            await handler(request, response);
            return; // Stop processing after the first match
        }
    }

    // Default handler if no match found
    response.writeHead(404);
    response.setHeader("Content-Type", "text/plain");
    response.write("Not Found");
    response.end();
}
