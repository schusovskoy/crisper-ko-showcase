import { IFilesService } from "./interfaces/IFilesService";
import { Required } from "crisper.di/annotations/Required";
import { Interface } from "crisper.std/Interface";
import { IFileRepository } from "../repositories/interfaces/IFileRepository";

export class FilesService implements IFilesService {
    @Required(new Interface<IFileRepository>("IFileRepository"))
    private fileRepository: IFileRepository;
    
    public upload(file: File, callback?: (progress: number) => void): Promise<string> {
        return this.fileRepository.upload(file, callback);
    }
    
    implementsIFilesService() {}
}