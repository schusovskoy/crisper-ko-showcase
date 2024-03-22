import { IFileRepository } from "./interfaces/IFileRepository";
import { AsyncRequest } from "crisper.ko/asyncrequest/AsyncRequest";

export class FileRepository implements IFileRepository {
    public async upload(file: File, callback?: (progress: number) => void): Promise<string> {
        const request: AsyncRequest = new AsyncRequest();
        request.open("POST", "/file");
        if (callback) request.onprogress = event => callback(event.loaded / event.total);
        request.timeout = 30000;
        
        const data: FormData = new FormData();
        data.append("file", file);
        const jsonPath: string = await request.send(data);
        return JSON.parse(jsonPath).path;
    }
    
    implementsIFileRepository() {}
}