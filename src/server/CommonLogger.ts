import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

function getIndent(indent: number | undefined) {
    if (indent === undefined || indent === 0) {
        return "";
    }

    return " ".repeat(indent * 4);
}

function applyIndent(message: string, indent: number) {
    const indentStr = getIndent(indent);
    return message
        .split("\n")
        .map((line) => (line.trim() === "" ? "" : indentStr + line))
        .join("\n");
}

export class CommonLogger {
    #indent = 0;
    #filePath: string | undefined;
    #consoleEnabled = true;

    indent() {
        this.#indent++;
    }

    outdent() {
        if (this.#indent > 0) {
            this.#indent--;
        }
    }

    #getIndent(options?: { indent?: number; indentAdjust?: number }): number {
        return Math.max(0, (options?.indent ?? this.#indent) + (options?.indentAdjust ?? 0));
    }

    startFile(filePath: string) {
        mkdirSync(dirname(filePath), { recursive: true });
        writeFileSync(filePath, "");
        this.#filePath = filePath;
    }

    endFile() {
        this.#filePath = undefined;
    }

    startConsole() {
        this.#consoleEnabled = true;
    }

    endConsole() {
        this.#consoleEnabled = false;
    }

    #writeToConsole(message: string, consoleLog: (message: string) => void) {
        if (this.#consoleEnabled) {
            consoleLog(message);
        }

        this.#writeToFile(message);
    }

    #writeToFile(message: string) {
        if (this.#filePath === undefined) {
            return;
        }

        try {
            appendFileSync(this.#filePath, `${message}\n`);
        } catch (error) {
            const filePath = this.#filePath;
            this.#filePath = undefined;
            console.error(`Failed to write log file ${filePath}: ${error}`);
        }
    }

    #write(message: string, level: "log" | "error", options?: { indent?: number; indentAdjust?: number }) {
        const indent = this.#getIndent(options);
        const indentedMessage = applyIndent(message, indent);
        this.#writeToConsole(indentedMessage, console[level]);
        this.#writeToFile(indentedMessage);
    }

    log(message: string, options?: { indent?: number; indentAdjust?: number }) {
        this.#write(message, "log", options);
    }

    error(message: string, options?: { indent?: number; indentAdjust?: number }) {
        this.#write(message, "error", options);
    }
}
