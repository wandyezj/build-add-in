import { readFileSync } from "fs";
import * as http from "http";
import path from "path";

/**
 * Get a handler that serves the file Path
 * @param filePath
 * @returns
 */
export function getServeFile(
    filePath: string,
    contentType: string
): (request: http.IncomingMessage, response: http.ServerResponse) => Promise<void> {
    return async (request: http.IncomingMessage, response: http.ServerResponse) => {
        const isBinary = contentType.startsWith("image/");
        const data = isBinary
            ? readFileSync(path.join(__dirname, filePath))
            : readFileSync(path.join(__dirname, filePath), "utf-8");
        response.writeHead(200);
        response.setHeader("Content-Type", contentType);
        response.setHeader("Cache-Control", "no-cache, no-store");
        response.end(data);
    };
}
