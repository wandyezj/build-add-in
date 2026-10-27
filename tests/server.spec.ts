import { test, expect } from "@playwright/test";
import { defaultHttpPort } from "../src/server/defaults";

function getPath(path: string) {
    const port = defaultHttpPort;
    return `http://localhost:${port}${path}`;
}

test("GET / ping", async ({ request }) => {
    const response = await request.get(getPath("/ping"));
    expect(response.ok()).toBeTruthy();

    const body = await response.text();
    expect(body).toContain("pong");
});
