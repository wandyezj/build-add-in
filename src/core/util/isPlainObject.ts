/**
 * Identify when a value is 'actually' an object, not "null", "[]", or a class instance.
 * - "null" - false
 * - "[]" - false
 * - "{}" - true
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.getPrototypeOf(value) === Object.prototype
    );
}
