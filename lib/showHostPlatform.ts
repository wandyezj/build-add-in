import { getHostColor } from "./getHostColor";

/**
 * Add the following to the end of the document body.
 * ```html
 * <h1>Hello host on platform!</h1>
 * ```
 * @param id The element id to append to.
 * @param host The name of the host.
 * @param platform The name of the platform.
 *
 * @beta
 */
export function showHostPlatform(id: string, host: string, platform: string): void {
    const h1 = document.createElement("h1");
    const hostColor = getHostColor(host);
    h1.innerHTML = `Hello <span style="color: ${hostColor}">${host}</span> on ${platform}!`;
    const container = document.getElementById(id);
    if (container) {
        container.appendChild(h1);
    }
}
