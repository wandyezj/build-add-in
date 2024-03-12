/**
 * Clones JSON objects
 * @param o
 */
export function objectClone<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
}
