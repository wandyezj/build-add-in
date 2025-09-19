import { uploadFile } from "./uploadFile";

export function uploadFileJson(): Promise<string> {
    return uploadFile(".json");
}
