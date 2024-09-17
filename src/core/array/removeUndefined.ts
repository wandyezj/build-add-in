export function removeUndefined<T>(array: (T | undefined)[]): T[] {
    return array.filter((x) => x !== undefined) as T[];
}
