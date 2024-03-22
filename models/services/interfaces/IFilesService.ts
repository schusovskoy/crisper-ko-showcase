export interface IFilesService {
    upload(file: File, callback?: (progress: number) => void): Promise<string>;
    implementsIFilesService?();
}