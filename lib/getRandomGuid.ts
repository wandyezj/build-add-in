/**
 * Get a Random Guid
 * Template: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 * @returns A new random GUID as a string.
 */
export function getRandomGuid(): string {
    return crypto.randomUUID();
}
