import * as http from "http";
import { FunctionRequestMatcher } from "./handleRequest";

export function getMatcher(match: {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
    url: string;
    origin?: string;
}): FunctionRequestMatcher {
    function matches(matchValue: string | undefined, requestValue: string | undefined): boolean {
        if (!matchValue) {
            return true; // If matcher is undefined, it matches anything
        }

        if (matchValue === requestValue) {
            return true; // Exact match
        }

        return false; // No match
    }

    function matcher(request: http.IncomingMessage): boolean {
        // the path is the part of the URL after the domain and port, without query parameters or hash
        const { pathname } = new URL(request.url ?? "", `http://localhost`);
        return (
            matches(match.method, request.method) &&
            matches(match.url, pathname) &&
            matches(match.origin, request.headers.origin)
        );
    }

    return matcher;
}
