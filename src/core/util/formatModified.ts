export function formatModified(modified: number): string {
    const now = Date.now();
    const delta = now - modified;

    const seconds = Math.floor(delta / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} ${days > 1 ? "days" : "day"} ago`;
    }

    if (hours > 0) {
        return `${hours} ${hours > 1 ? "hours" : "hour"} ago`;
    }

    if (minutes > 0) {
        return `${minutes} ${minutes > 1 ? "minutes" : "minute"} ago`;
    }

    if (seconds > 0) {
        return `${seconds} ${seconds > 1 ? "seconds" : "second"} ago`;
    }

    return "Just Edited";

    // const date = new Date(modified);
    // return date.toLocaleString();
}
