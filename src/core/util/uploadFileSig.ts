import { uploadFile } from "./uploadFile";

export function uploadFileSig(): Promise<string> {
    return uploadFile(".sig");
}
