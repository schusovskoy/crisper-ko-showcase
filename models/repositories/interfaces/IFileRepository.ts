export interface IFileRepository {
    upload(file: File, callback?: (progress: number) => void): Promise<string>;
    implementsIFileRepository?();
}